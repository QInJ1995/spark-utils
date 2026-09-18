/**
 * 随机字符串生成（忠实移植旧 src/crypto/create64Key.js，含默认导出改具名导出）
 *
 * 字符域为 62 个字符（a-z、A-Z、0-9，顺序与旧版一致）；
 * flag 为真时返回 encodeURIComponent 后再 btoa 的 base64。
 */

/** 随机字符域：小写字母 + 大写字母 + 数字（顺序与旧版数组一致） */
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/**
 * 生成指定长度的随机字符串
 * @param length 长度（<=0 时返回空串，与旧版一致）
 * @param flag 为真时对结果做 encodeURIComponent + btoa 编码后返回
 * @returns 随机字符串（或其 base64 编码）
 */
export function create64Key(length: number, flag?: boolean): string {
  let str = ''
  for (let i = 0; i < length; i++) {
    str += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  if (flag) {
    return btoa(encodeURIComponent(str))
  }
  return str
}
