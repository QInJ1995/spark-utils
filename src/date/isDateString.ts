/**
 * 判断是否为日期格式（移植自旧 src/date/isDateString.js）
 *
 * 内部依赖文件：仅供 date 域内 isDateTime/StringToDate/dateDiff 使用，
 * 不进入模块出口（旧版亦未在 index.js 导出）。
 *
 * 行为（含怪癖）与旧版一致：
 * - 仅接受 yyyy-MM-dd / yyyy/MM/dd（10 位、三段式）；
 * - 年份段长度须为 4；合法性经 new Date 回读比对（2024-02-30、2024-13-01 均否）；
 * - 入参无 length（如数字）不抛错，直接 false。
 */
/**
 * 判断是否为日期格式
 *
 * @param dateval 目标串（yyyy-MM-dd 或 yyyy/MM/dd）
 * @returns 是日期格式返回 true
 */
export function isDateString(dateval: string): boolean {
  let arr: string[] = []
  if (dateval.length !== 10) {
    return false
  }
  if (dateval.indexOf('-') !== -1) {
    arr = dateval.toString().split('-')
  } else if (dateval.indexOf('/') !== -1) {
    arr = dateval.toString().split('/')
  } else {
    return false
  }
  if (arr.length !== 3) {
    return false
  }
  const yearStr = arr[0]
  // yyyy-mm-dd || yyyy/mm/dd
  if (yearStr !== undefined && yearStr.length === 4) {
    const year = Number(yearStr)
    const date = new Date(year, Number(arr[1]) - 1, Number(arr[2]))
    if (
      date.getFullYear() === year &&
      date.getMonth() === Number(arr[1]) - 1 &&
      date.getDate() === Number(arr[2])
    ) {
      return true
    }
  }
  return false
}
