/**
 * AES 加解密（crypto-js，CBC + PKCS7，密钥 16/24/32 字节、初始向量 16 字节）
 *
 * 旧行为差异（破坏性，MIGRATION 登记）：
 * - 旧版（src/crypto/aes.js）无 try/catch，异常直接抛原生 Error；
 *   新版将异常统一包装为 CryptoError（ENCRYPT_FAILED / DECRYPT_FAILED）。
 * - 新增密钥/初始向量字节长度校验，不合法抛 CryptoError('INVALID_KEY')：
 *   旧版对非 16/24/32 字节密钥会静默产出无法往返解密的乱码密文
 *   （已实测 15 字节密钥加密后自身解不回），新版按密码学约定显式拒绝。
 * - 长度合法但错误的密钥解密仍返回乱码且不抛错（CBC 无认证，与旧版一致）。
 */
import CryptoJS from 'crypto-js'
import type { WordArray } from 'crypto-js'
import { CryptoError } from './error'

/** AES 密钥允许的 UTF-8 字节长度（对应 128/192/256 位） */
const AES_KEY_BYTES: readonly number[] = [16, 24, 32]

/** CBC 模式初始向量的字节长度 */
const AES_IV_BYTES = 16

/** 解析并校验密钥/初始向量（长度以 crypto-js Utf8 解析后的字节长度为准） */
function parseAesKeyIv(keyStr: string, ivStr: string): { key: WordArray; iv: WordArray } {
  let key: WordArray
  let iv: WordArray
  try {
    key = CryptoJS.enc.Utf8.parse(keyStr)
    iv = CryptoJS.enc.Utf8.parse(ivStr)
  } catch (e) {
    throw new CryptoError('INVALID_KEY', `AES 密钥/初始向量无法按 UTF-8 解析：${String(e)}`, e)
  }
  if (!AES_KEY_BYTES.includes(key.sigBytes)) {
    throw new CryptoError(
      'INVALID_KEY',
      `AES 密钥长度非法：${key.sigBytes} 字节（仅允许 16/24/32）`,
    )
  }
  if (iv.sigBytes !== AES_IV_BYTES) {
    throw new CryptoError('INVALID_KEY', `AES 初始向量长度非法：${iv.sigBytes} 字节（仅允许 16）`)
  }
  return { key, iv }
}

/**
 * aes 加密：秘钥 256 位（按传入长度 128/192/256）、iv 16 字节、CBC、PKCS7
 * @param data 加密的字符串
 * @param keyStr 秘钥（UTF-8 字节长度 16/24/32）
 * @param ivStr 初始向量（UTF-8 字节长度 16）
 * @returns 加密后的 base64 字符串
 */
export function aesEncrypt(data: string, keyStr: string, ivStr: string): string {
  const { key, iv } = parseAesKeyIv(keyStr, ivStr)
  try {
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypted.toString()
  } catch (e) {
    throw new CryptoError('ENCRYPT_FAILED', `AES 加密失败：${String(e)}`, e)
  }
}

/**
 * aes 解密：与 aesEncrypt 参数约定一致
 * @param data 密文（base64）
 * @param keyStr 秘钥（UTF-8 字节长度 16/24/32）
 * @param ivStr 初始向量（UTF-8 字节长度 16）
 * @returns 解密后的明文字符串
 */
export function aesDecrypt(data: string, keyStr: string, ivStr: string): string {
  const { key, iv } = parseAesKeyIv(keyStr, ivStr)
  try {
    const decrypted = CryptoJS.AES.decrypt(data, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return CryptoJS.enc.Utf8.stringify(decrypted)
  } catch (e) {
    throw new CryptoError('DECRYPT_FAILED', `AES 解密失败：${String(e)}`, e)
  }
}
