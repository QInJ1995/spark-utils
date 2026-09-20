/**
 * 生成随机 uuid（移植自旧 src/string/uuid.js）
 *
 * - 不传 len：生成 RFC4122 v4 形式（36 位，uuid[8]/[13]/[18]/[23] 为 '-'、
 *   uuid[14] 为版本位 '4'、i==19 处取 (r & 0x3) | 0x8）；
 * - 传 len：生成紧凑形式，字符取自 CHARS 前 radix 位（radix 缺省 62）。
 *
 * 使用 Math.random（非加密安全），快照测试按随机源排除对照。
 */
const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

/**
 * 生成随机 uuid
 * @param len 生成的长度（紧凑形式；缺省生成 36 位 RFC4122 v4 形式）
 * @param radix 基数，可选任意数（缺省 CHARS.length = 62）
 */
export function uuid(len?: number, radix?: number): string {
  const uuidArr: string[] = []
  const useRadix = radix || CHARS.length
  if (len) {
    // Compact form
    for (let i = 0; i < len; i++) {
      uuidArr[i] = CHARS[0 | (Math.random() * useRadix)] ?? ''
    }
  } else {
    // rfc4122, version 4 form
    let r = -1
    // rfc4122 requires these characters
    uuidArr[8] = uuidArr[13] = uuidArr[18] = uuidArr[23] = '-'
    uuidArr[14] = '4'
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (let i = 0; i < 36; i++) {
      if (!uuidArr[i]) {
        r = 0 | (Math.random() * 16)
        uuidArr[i] = CHARS[i === 19 ? (r & 0x3) | 0x8 : r] ?? ''
      }
    }
  }
  return uuidArr.join('')
}
