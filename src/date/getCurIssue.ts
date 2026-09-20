/**
 * 获取当前期号 YYYYMM（移植自旧 src/date/getCurIssue.js）
 */

/**
 * 获取当前期号 YYYYMM
 *
 * @returns 当前期号串（本地时区，月份补零）
 */
export function getCurIssue(): string {
  const d = new Date()
  let ret = d.getFullYear() + ''
  const month = d.getMonth() + 1
  if (parseInt(String(month)) < 10) {
    ret += '0' + month
  } else {
    ret += '' + month
  }
  return ret
}
