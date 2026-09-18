/**
 * crypto 域统一错误类型
 *
 * 旧行为差异（破坏性，MIGRATION 登记）：
 * 旧版（src/crypto/*.js）所有 try/catch 均吞掉异常并返回 false；
 * 2.0 起统一抛出携带错误码的 CryptoError，原始异常保留在 cause 上。
 */

/** 错误码：按密码学操作阶段划分 */
export type CryptoErrorCode =
  /** 加密失败（aesEncrypt / rsaEncrypt / sm4Encrypt / sm2Encrypt） */
  | 'ENCRYPT_FAILED'
  /** 解密失败（aesDecrypt / rsaDecrypt / sm4Decrypt） */
  | 'DECRYPT_FAILED'
  /** 签名/摘要失败（md5Sign / rsaSign / sm3Sign） */
  | 'SIGN_FAILED'
  /** 验签处理异常（rsaVerify；验签不通过仍返回 false，不抛错） */
  | 'VERIFY_FAILED'
  /** MD5 计算失败（md5Sign 的兜底错误码） */
  | 'MD5_FAILED'
  /** 密钥/初始向量不合法（长度或编码不符合约定） */
  | 'INVALID_KEY'

/** crypto 域错误：所有加密方法失败时抛出 */
export class CryptoError extends Error {
  /** 错误码 */
  readonly code: CryptoErrorCode

  /** 触发错误的底层异常（crypto-js / jsrsasign / vendored SM 实现抛出的原始错误），无则为 undefined */
  readonly cause: unknown

  constructor(code: CryptoErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = 'CryptoError'
    this.code = code
    this.cause = cause
  }
}
