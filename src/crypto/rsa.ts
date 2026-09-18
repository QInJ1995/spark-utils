/**
 * RSA 加解密与签名/验签（jsrsasign）
 *
 * 密钥传参约定（与旧版一致）：pubKey/privKey 均为「PEM 文本的 base64」
 * （内部先经 b64toutf8 还原为 PEM 再交 KEYUTIL 解析），
 * 直接传 PEM 原文或 DER 的 base64 均无法解析。
 *
 * 旧行为差异（破坏性，MIGRATION 登记）：
 * - 旧版（src/crypto/rsa.js）所有方法 try/catch 吞错返回 false；新版抛
 *   CryptoError（ENCRYPT_FAILED / DECRYPT_FAILED / SIGN_FAILED / VERIFY_FAILED）。
 * - rsaVerify 仅「处理过程异常」（密钥无法解析等）抛错；
 *   验签不通过仍返回 false（旧版两种情况都返回 false）。
 */
import { KEYUTIL, KJUR, hextob64, b64tohex, b64toutf8 } from 'jsrsasign'
import { CryptoError } from './error'

/** 加解密默认算法（RSAES-OAEP + SHA-1） */
const DEFAULT_CIPHER_ALG = 'RSAOAEP'

/** 签名算法（与旧版写死一致） */
const SIGN_ALG = 'SHA1withRSA'

/** 还原密钥：base64(PEM 文本) => PEM 文本 */
function decodeKeyPem(b64Key: string): string {
  return b64toutf8(b64Key)
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
    const pub = KEYUTIL.getKey(decodeKeyPem(pubKey))
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
    const prv = KEYUTIL.getKey(decodeKeyPem(privKey))
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
    const signature = new KJUR.crypto.Signature({
      alg: SIGN_ALG,
      prvkeypem: decodeKeyPem(privKey),
    })
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
 * @param pubKey 公钥（PEM 文本的 base64；与旧实现一致，内部经 prvkeypem 参数传入，
 *               jsrsasign 依据密钥的 isPublic 标记自动分派到验签状态）
 * @returns 验签是否通过；密钥/签名无法解析时抛 CryptoError
 */
export function rsaVerify(data: string, signStr: string, pubKey: string): boolean {
  try {
    const signatureVf = new KJUR.crypto.Signature({
      alg: SIGN_ALG,
      prvkeypem: decodeKeyPem(pubKey),
    })
    // 需要先对 data 编码
    signatureVf.updateString(data)
    // 验签入参是 16 进制字符串，注意转码
    return signatureVf.verify(b64tohex(signStr))
  } catch (e) {
    throw new CryptoError('VERIFY_FAILED', `RSA 验签失败：${String(e)}`, e)
  }
}
