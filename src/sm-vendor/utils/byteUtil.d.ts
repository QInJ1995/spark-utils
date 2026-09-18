/**
 * 字节流转换工具（vendored）
 *
 * 实现见相邻 byteUtil.js，与旧 src/crypto/sm/crypto/utils/byteUtil.js 逐字节一致；
 * 被 vendored sm3-1.0.js / sm4-1.0.js 内部引用。
 */

/** 数组复制：src 的 [pos1, pos1+len) => dest 的 [pos2, pos2+len)（带边界收敛） */
export declare function arrayCopy(
  src: readonly number[],
  pos1: number,
  dest: number[],
  pos2: number,
  len: number,
): void

/** 长整型（仅低四字节有效）=> 8 字节数组 */
export declare function longToByte(num: number): number[]

/** int 数值 => 4 字节数组 */
export declare function intToByte(num: number): number[]

/** int 数组 => byte 数组（一个 int 展开为四个 byte） */
export declare function intArrayToByteArray(nums: readonly number[]): number[]

/** byte 数组 pos 位置起 4 字节 => int 数值（不足 4 字节时按剩余长度折叠） */
export declare function byteToInt(b: readonly number[], pos: number): number

/** byte 数组 => int 数组（每四个字节折叠为一个 int，不足向上取整） */
export declare function byteArrayToIntArray(b: readonly number[]): number[]

/** 按字节大小将字符串分割成片段数组（非 ASCII 字符计 2 字节） */
export declare function reBytesStrArr(str: string, len: number): string[]

/** 获取字符串的字节数（非 ASCII 字符计 2 字节） */
export declare function getStrBytes(str: string): number
