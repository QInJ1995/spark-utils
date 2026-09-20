/**
 * 获取当前年份 YYYY（移植自旧 src/date/getCurDateYear.js）
 */

/**
 * 获取当前年份 YYYY
 *
 * @returns 当前年份串（本地时区）
 */
export function getCurDateYear(): string {
  const d = new Date()
  return d.getFullYear() + ''
}
