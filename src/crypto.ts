/**
 * spark-utils/crypto 子入口：加密方法（M6）
 *
 * 旧 `import sparkUtils from 'spark-utils'` + `sparkUtils.crypto.xxx` 的嵌套命名空间
 * 改为具名导出打平：`import { aesEncrypt } from 'spark-utils/crypto'`。
 *
 * 错误处理（破坏性，MIGRATION 登记）：
 * 旧版所有方法 try/catch 吞错返回 false，2.0 起统一抛 CryptoError（code 携带
 * 错误码，原始异常保留在 cause）；验签不通过仍返回 false。
 *
 * 依赖说明：
 * - aes/md5 统一使用 crypto-js（旧 md5 取 jsrsasign 内置 CryptoJS，输出不变）；
 * - rsa 使用 jsrsasign（密钥传参为「PEM 文本的 base64」，与旧版一致）；
 * - SM 系列使用 src/sm-vendor（vendored 副本，随本入口打包、不 external），
 *   已打同构守卫补丁（sm-vendor/README.md），纯 Node import 无需注入 window。
 *
 * 未移植项：旧 sm wrapper 内部的 sm2GroupingEncrypt 与空实现的 sm2Decrypt
 * 从未出现在旧 crypto 命名空间导出面上，故不再提供。
 */
export {
  aesEncrypt,
  aesDecrypt,
  md5Sign,
  rsaEncrypt,
  rsaDecrypt,
  rsaSign,
  rsaVerify,
  sm4Encrypt,
  sm4Decrypt,
  sm3Sign,
  sm2Encrypt,
  create64Key,
  CryptoError,
} from './crypto/index'
export type { CryptoErrorCode } from './crypto/index'
