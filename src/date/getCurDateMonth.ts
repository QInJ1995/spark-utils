/**
 * 获取当前日期 YYYY-MM（移植自旧 src/date/getCurDateMonth.js）
 */

/**
 * 获取当前日期 YYYY-MM
 *
 * @returns 当前年月串（本地时区）
 */
export function getCurDateMonth(): string {
  const d = new Date()
  let ret = d.getFullYear() + '-'
  ret += ('00' + (d.getMonth() + 1)).slice(-2)
  return ret
}
