/**
 * 国密 SM 系列（SM2/SM3/SM4）——旧 src/crypto/sm/index.js wrapper 的移植
 *
 * 依赖改指 ../sm-vendor（vendored 副本，内容与旧 src/crypto/sm/crypto 逐字节一致；
 * sm-vendor 不 external，会随 crypto 入口一起打包）。
 *
 * 旧行为差异（破坏性，MIGRATION 登记）：
 * - 旧版 wrapper 所有 try/catch 吞错返回 false；新版抛 CryptoError
 *   （ENCRYPT_FAILED / DECRYPT_FAILED / SIGN_FAILED）。
 * - 新增 SM4 密钥/初始向量校验（INVALID_KEY）：b64 解码失败或长度非 16 字节
 *   显式拒绝；旧版对畸形密钥静默产出乱码密文（与 aes 的 2.0 收紧一致）。
 * - 旧 wrapper 内部的 sm2GroupingEncrypt / sm2Decrypt 空实现未移植：
 *   两者从未出现在旧 crypto 命名空间的公共导出面上。
 *
 * 同构说明：vendored sm2-1.0.js 已打 __su_nav/__su_win 守卫补丁（见
 * sm-vendor/README.md），纯 Node 环境 import 无需注入 window。
 */
import Hex from '../sm-vendor/utils/hex'
import SM3 from '../sm-vendor/sm3-1.0'
import SM4 from '../sm-vendor/sm4-1.0'
import SM2 from '../sm-vendor/sm2-1.0'
import { CryptoError } from './error'

/** SM4 密钥与初始向量固定 16 字节（GB/T 32907） */
const SM4_KEY_BYTES = 16
const SM4_IV_BYTES = 16

/**
 * 校验并解码 SM4 密钥/初始向量（与 aes 的 INVALID_KEY 收紧一致）：
 * b64 解码失败或字节长度非 16 抛 CryptoError('INVALID_KEY')，
 * 旧版对畸形密钥静默产出无法往返的乱码密文。
 */
function parseSm4Key(keyStr: string, ivStr: string): { key: number[]; iv: number[] } {
  let key: number[]
  let iv: number[]
  try {
    key = Hex.b64toBA(keyStr)
    iv = Hex.b64toBA(ivStr)
  } catch (e) {
    throw new CryptoError('INVALID_KEY', `SM4 密钥/初始向量无法按 base64 解析：${String(e)}`, e)
  }
  if (key.length !== SM4_KEY_BYTES) {
    throw new CryptoError('INVALID_KEY', `SM4 密钥长度非法：${key.length} 字节（仅允许 16）`)
  }
  if (iv.length !== SM4_IV_BYTES) {
    throw new CryptoError('INVALID_KEY', `SM4 初始向量长度非法：${iv.length} 字节（仅允许 16）`)
  }
  return { key, iv }
}

/**
 * sm4 加密（CBC，PKCS7 填充）
 * @param data 明文
 * @param keyStr 秘钥 key 的 base64（解码后须为 16 字节）
 * @param ivStr iv 的 base64（解码后须为 16 字节）
 * @returns base64 密文
 */
export function sm4Encrypt(data: string, keyStr: string, ivStr: string): string {
  const { key, iv } = parseSm4Key(keyStr, ivStr)
  try {
    // utf-8 字符串 => byte 数组
    const value = Hex.utf8StrToBytes(data)
    const sm4 = new SM4()
    // 入参全部为 byte，返回的值为 byte
    const rs = sm4.encrypt_cbc(key, iv, value)
    return Hex.BAtob64(rs)
  } catch (e) {
    throw new CryptoError('ENCRYPT_FAILED', `SM4 加密失败：${String(e)}`, e)
  }
}

/**
 * sm4 解密（CBC，去 PKCS7 填充）
 * @param data 密文（base64，字节数须为 16 的整数倍）
 * @param keyStr 秘钥 key 的 base64
 * @param ivStr iv 的 base64
 * @returns 明文字符串
 */
export function sm4Decrypt(data: string, keyStr: string, ivStr: string): string {
  const { key, iv } = parseSm4Key(keyStr, ivStr)
  try {
    const value = Hex.b64toBA(data)
    const sm4 = new SM4()
    const rs = sm4.decrypt_cbc(key, iv, value)
    return Hex.bytesToUtf8Str(rs)
  } catch (e) {
    throw new CryptoError('DECRYPT_FAILED', `SM4 解密失败：${String(e)}`, e)
  }
}

/**
 * sm3 签名（杂凑）
 * @param data 明文
 * @returns 大写 16 进制摘要字符串（32 字节）
 */
export function sm3Sign(data: string): string {
  try {
    const dataBy = Hex.utf8StrToBytes(data)
    const sm3 = new SM3()
    // 数据很多的话，可以分多次 update
    sm3.update(dataBy, 0, dataBy.length)
    const sm3Hash = sm3.doFinal()
    // 编码成 16 进制可见字符（大写）
    return Hex.encode(sm3Hash, 0, sm3Hash.length)
  } catch (e) {
    throw new CryptoError('SIGN_FAILED', `SM3 签名失败：${String(e)}`, e)
  }
}

/**
 * sm2 加密（仅加密；vendored 实现未提供解密，与旧版一致）
 * @param data 明文
 * @param pubKey 公钥（其 base64 解码后为 16 进制公钥串：04+x+y 或 x+y）
 * @returns base64 密文（解码后首字节 0x04，长度 = 97 + 明文 UTF-8 字节数）
 */
export function sm2Encrypt(data: string, pubKey: string): string {
  try {
    const pk = Hex.b64tohex(pubKey)
    // 获取加密过后的密文（cipherMode 0 = C1C2C3，与旧 wrapper 调用一致）
    const rs = SM2(data, pk, 0)
    return Hex.hextob64(rs)
  } catch (e) {
    throw new CryptoError('ENCRYPT_FAILED', `SM2 加密失败：${String(e)}`, e)
  }
}
