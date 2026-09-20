/**
 * vendored SM 实现依赖的外部库最小类型垫片
 *
 * crypto-js / jsrsasign 均未随包提供类型声明，也未安装 @types；
 * 本文件只服务于 tsconfig.sm-vendor.json 程序（checkJs 关闭，
 * 此处仅保证模块可解析），主程序使用 src/crypto/crypto-libs.d.ts
 * 的垫片——两处作用域互不重叠，避免重复声明冲突。
 */

declare module 'crypto-js' {
  /** crypto-js 字节数组抽象 */
  export interface WordArray {
    readonly sigBytes: number
    toString(): string
  }
  const CryptoJS: {
    readonly lib: {
      readonly WordArray: {
        init(words?: unknown[], sigBytes?: number): WordArray
      }
    }
    readonly enc: {
      readonly Utf8: {
        parse(text: string): WordArray
        stringify(wordArray: WordArray): string
      }
    }
    readonly MD5(message: string): WordArray
  }
  export default CryptoJS
}

declare module 'jsrsasign' {
  /** 16 进制字符串 => base64 */
  export function hextob64(hex: string): string
  /** base64 => 16 进制字符串（非法字符被跳过） */
  export function b64tohex(b64: string): string
  /** base64 => byte 数组 */
  export function b64toBA(b64: string): number[]
  /** byte 数组 => 16 进制字符串 */
  export function BAtohex(byteArray: readonly number[]): string
}
