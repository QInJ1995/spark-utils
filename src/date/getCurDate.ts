/**
 * 获取当前日期 YYYY-MM-DD（移植自旧 src/date/getCurDate.js）
 */

/**
 * 获取当前日期 YYYY-MM-DD
 *
 * @returns 当前日期串（本地时区）
 */
export function getCurDate(): string {
  const d = new Date()
  let ret = d.getFullYear() + '-'
  ret += ('00' + (d.getMonth() + 1)).slice(-2) + '-'
  ret += ('00' + d.getDate()).slice(-2)
  return ret
}
