/**
 * 随机字符串生成（移植旧 src/crypto/create64Key.js，含默认导出改具名导出）
 *
 * 字符域为 62 个字符（a-z、A-Z、0-9，顺序与旧版一致）；
 * flag 为真时返回 encodeURIComponent 后再 btoa 的 base64。
 *
 * 2.0 变更：随机源由 Math.random 改为优先 CSPRNG（globalThis.crypto.getRandomValues，
 * Node 18+/现代浏览器均内置），拒绝采样消除模偏差；运行环境不可用时回退
 * Math.random（非密码学安全，仅保证行为可用）。本方法生成的是可见字符随机串，
 * 不替代正式密钥派生。
 */

/** 随机字符域：小写字母 + 大写字母 + 数字（顺序与旧版数组一致） */
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/** [0, max) 均匀随机整数：优先 CSPRNG + 拒绝采样（丢弃使取模有偏的高位区间） */
function randomIndex(max: number): number {
  const cryptoObj = globalThis.crypto
  if (cryptoObj?.getRandomValues) {
    const limit = Math.floor(0x100000000 / max) * max
    const buf = new Uint32Array(1)
    let value: number
    do {
      cryptoObj.getRandomValues(buf)
      value = buf[0] as number
    } while (value >= limit)
    return value % max
  }
  return Math.floor(Math.random() * max)
}

/**
 * 生成指定长度的随机字符串
 * @param length 长度（<=0 时返回空串，与旧版一致）
 * @param flag 为真时对结果做 encodeURIComponent + btoa 编码后返回
 * @returns 随机字符串（或其 base64 编码）
 */
export function create64Key(length: number, flag?: boolean): string {
  let str = ''
  for (let i = 0; i < length; i++) {
    str += CHARS.charAt(randomIndex(CHARS.length))
  }
  if (flag) {
    return btoa(encodeURIComponent(str))
  }
  return str
}
