// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- crypto-js/jsrsasign 无官方类型，环境模块垫片只能以 declare module 声明、经 reference 随模块图传播（import 方式无法为外部包提供声明），见下
/// <reference path="./crypto-libs.d.ts" />
/**
 * crypto 域聚合导出（每方法一文件）
 *
 * 顶部 reference 将 crypto-js / jsrsasign 的环境模块垫片（crypto-libs.d.ts）
 * 纳入程序：两个库均未提供类型包，垫片需随模块图传播，
 * 否则仅 include 了消费方（如测试 tsconfig）的程序无法解析这两个导入。
 */
export { aesEncrypt, aesDecrypt } from './aes'
export { md5Sign } from './md5'
export { rsaSign, rsaVerify } from './rsa'
export { sm4Encrypt, sm4Decrypt, sm3Sign, sm2Encrypt } from './sm'
export { create64Key } from './create64Key'
export { CryptoError } from './error'
export type { CryptoErrorCode } from './error'
