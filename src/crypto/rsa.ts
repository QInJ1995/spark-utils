/**
 * RSA 加解密与签名/验签（jsrsasign）
 *
 * 密钥传参约定（与旧版一致）：pubKey/privKey 均为「PEM 文本的 base64」
 * （内部先经 b64toutf8 还原为 PEM 再交 KEYUTIL 解析），
 * 直接传 PEM 原文或 DER 的 base64 均无法解析。
 *
 * 2.0 性能：PEM -> 密钥对象解析结果按入参缓存（KEYUTIL.getKey 实测约占
 * 单次加密调用的 ~10%，验签等轻操作占比更高；复用密钥对象与逐次解析
 * 输出逐位一致，已对加/解/签/验四路实证）。缓存只收解析成功的条目，
 * 软上限 64 条防无界增长；密钥对象只读复用，jsrsasign 不在其上留状态。
 *
 * 旧行为差异（破坏性，MIGRATION 登记）：
 * - 旧版（src/crypto/rsa.js）所有方法 try/catch 吞错返回 false；新版抛
 *   CryptoError（ENCRYPT_FAILED / DECRYPT_FAILED / SIGN_FAILED / VERIFY_FAILED）。
 * - rsaVerify 仅「处理过程异常」（密钥无法解析等）抛错；
 *   验签不通过仍返回 false（旧版两种情况都返回 false）。
 */
import { KEYUTIL, KJUR, hextob64, b64tohex, b64toutf8 } from 'jsrsasign'
import type { RSAKeyObject } from 'jsrsasign'
import { CryptoError } from './error'

/** 加解密默认算法（RSAES-OAEP + SHA-1） */
const DEFAULT_CIPHER_ALG = 'RSAOAEP'

/** 签名算法（与旧版写死一致） */
const SIGN_ALG = 'SHA1withRSA'

/** 密钥对象缓存软上限（超出整体清空：调用方密钥集合通常个位数） */
const KEY_CACHE_LIMIT = 64

/** 已解析密钥缓存：base64(PEM) 入参 -> 密钥对象（成功才入缓存） */
const keyCache = new Map<string, RSAKeyObject>()

/** 解析密钥（base64(PEM 文本)），解析失败原样抛出、不入缓存 */
function parseKey(b64Key: string): RSAKeyObject {
  let key = keyCache.get(b64Key)
  if (key === undefined) {
    key = KEYUTIL.getKey(b64toutf8(b64Key))
    if (keyCache.size >= KEY_CACHE_LIMIT) {
      keyCache.clear()
    }
    keyCache.set(b64Key, key)
  }
  return key
}

/**
 * rsa 加密
 * @param data 明文
 * @param pubKey 公钥（PEM 文本的 base64）
 * @param algName 加密算法，默认 RSAOAEP
 * @returns base64 密文
 */
export function rsaEncrypt(data: string, pubKey: string, algName?: string): string {
  try {
    const pub = parseKey(pubKey)
    const enc = KJUR.crypto.Cipher.encrypt(data, pub, algName ?? DEFAULT_CIPHER_ALG)
    return hextob64(enc)
  } catch (e) {
    throw new CryptoError('ENCRYPT_FAILED', `RSA 加密失败：${String(e)}`, e)
  }
}

/**
 * rsa 解密
 * @param data 密文（base64）
 * @param privKey 私钥（PEM 文本的 base64）
 * @param algName 解密算法，默认 RSAOAEP（须与加密时一致）
 * @returns 明文字符串
 */
export function rsaDecrypt(data: string, privKey: string, algName?: string): string {
  try {
    const prv = parseKey(privKey)
    const dec = KJUR.crypto.Cipher.decrypt(b64tohex(data), prv, algName ?? DEFAULT_CIPHER_ALG)
    return dec
  } catch (e) {
    throw new CryptoError('DECRYPT_FAILED', `RSA 解密失败：${String(e)}`, e)
  }
}

/**
 * rsa 签名（SHA1withRSA）
 * @param data 明文
 * @param privKey 私钥（PEM 文本的 base64）
 * @returns base64 签名
 */
export function rsaSign(data: string, privKey: string): string {
  try {
    const signature = new KJUR.crypto.Signature({ alg: SIGN_ALG })
    signature.init(parseKey(privKey))
    signature.updateString(data)
    return hextob64(signature.sign())
  } catch (e) {
    throw new CryptoError('SIGN_FAILED', `RSA 签名失败：${String(e)}`, e)
  }
}

/**
 * rsa 验签（SHA1withRSA）
 * @param data 明文
 * @param signStr 签名（base64）
 * @param pubKey 公钥（PEM 文本的 base64；经 init 注入密钥对象，与旧实现的
 *               prvkeypem 传参逐位等价，jsrsasign 依据密钥的 isPublic
 *               标记自动分派到验签状态）
 * @returns 验签是否通过；密钥/签名无法解析时抛 CryptoError
 */
export function rsaVerify(data: string, signStr: string, pubKey: string): boolean {
  try {
    const signatureVf = new KJUR.crypto.Signature({ alg: SIGN_ALG })
    signatureVf.init(parseKey(pubKey))
    // 需要先对 data 编码
    signatureVf.updateString(data)
    // 验签入参是 16 进制字符串，注意转码
    return signatureVf.verify(b64tohex(signStr))
  } catch (e) {
    throw new CryptoError('VERIFY_FAILED', `RSA 验签失败：${String(e)}`, e)
  }
}
