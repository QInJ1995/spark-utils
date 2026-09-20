/**
 * MD5 摘要
 *
 * 依赖统一说明：旧版（src/crypto/md5.js）取 jsrsasign 内置的 CryptoJS.MD5，
 * 2.0 统一改用 crypto-js 的 MD5——两者算法一致，输出（32 位小写 16 进制）不变，
 * 并减少一处对 jsrsasign 的依赖面。
 *
 * 旧行为差异（破坏性，MIGRATION 登记）：旧版 try/catch 吞错返回 false，
 * 新版抛 CryptoError('MD5_FAILED')。
 */
import CryptoJS from 'crypto-js'
import { CryptoError } from './error'

/**
 * md5 摘要签名
 * @param data 明文
 * @returns 32 位小写 16 进制摘要字符串
 */
export function md5Sign(data: string): string {
  try {
    return CryptoJS.MD5(data).toString()
  } catch (e) {
    throw new CryptoError('MD5_FAILED', `MD5 计算失败：${String(e)}`, e)
  }
}
