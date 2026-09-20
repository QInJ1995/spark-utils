/**
 * 字节/16 进制/base64 转换工具（vendored）
 *
 * 实现见相邻 hex.js，与旧 src/crypto/sm/crypto/utils/hex.js 逐字节一致；
 * 其中 b64 系列转调 jsrsasign 的同名函数。
 */

declare const Hex: {
  /** byte 数组的 [pos, pos+len) 区间 => 大写 16 进制字符串 */
  encode(b: readonly number[], pos: number, len: number): string
  /** 16 进制字符串 => byte 数组；空串或奇数长度返回 null */
  decode(hex: string): number[] | null
  /** UTF-8 字符串 => byte 数组（内部经 encodeURIComponent/unescape 往返） */
  utf8StrToBytes(utf8Str: string): number[]
  /** byte 数组 => UTF-8 字符串 */
  bytesToUtf8Str(bytes: readonly number[]): string
  /** 16 进制 => base64（jsrsasign hextob64） */
  hextob64(hex: string): string
  /** base64 => 16 进制（jsrsasign b64tohex，非法字符被跳过） */
  b64tohex(b64: string): string
  /** base64 => byte 数组（jsrsasign b64toBA） */
  b64toBA(b64: string): number[]
  /** byte 数组 => base64（经 BAtohex + hextob64） */
  BAtob64(ba: readonly number[]): string
}

export default Hex
