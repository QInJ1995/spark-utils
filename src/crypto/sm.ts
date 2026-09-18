/**
 * 国密 SM 系列（SM2/SM3/SM4）——旧 src/crypto/sm/index.js wrapper 的移植
 *
 * 依赖改指 ../sm-vendor（vendored 副本，内容与旧 src/crypto/sm/crypto 逐字节一致；
 * sm-vendor 不 external，会随 crypto 入口一起打包）。
 *
 * 旧行为差异（破坏性，MIGRATION 登记）：
 * - 旧版 wrapper 所有 try/catch 吞错返回 false；新版抛 CryptoError
 *   （ENCRYPT_FAILED / DECRYPT_FAILED / SIGN_FAILED）。
 * - 旧 wrapper 内部的 sm2GroupingEncrypt / sm2Decrypt 空实现未移植：
 *   两者从未出现在旧 crypto 命名空间的公共导出面上。
 *
 * 已知限制（与旧版一致）：vendored sm2-1.0.js 在模块加载期读取 window/navigator
 * 全局，纯 Node 环境 import 本模块前需先注入 window（如 globalThis.window = globalThis）。
 */
import Hex from '../sm-vendor/utils/hex'
import SM3 from '../sm-vendor/sm3-1.0'
import SM4 from '../sm-vendor/sm4-1.0'
import SM2 from '../sm-vendor/sm2-1.0'
import { CryptoError } from './error'

/**
 * sm4 加密（CBC，PKCS7 填充）
 * @param data 明文
 * @param keyStr 秘钥 key 的 base64（解码后须为 16 字节）
 * @param ivStr iv 的 base64（解码后须为 16 字节）
 * @returns base64 密文
 */
export function sm4Encrypt(data: string, keyStr: string, ivStr: string): string {
  try {
    // utf-8 字符串 => byte 数组
    const value = Hex.utf8StrToBytes(data)
    const key = Hex.b64toBA(keyStr)
    const iv = Hex.b64toBA(ivStr)
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
  try {
    const value = Hex.b64toBA(data)
    const key = Hex.b64toBA(keyStr)
    const iv = Hex.b64toBA(ivStr)
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
