/**
 * 比较两个日期是否相同（旧 src/basic/isDateSame.js）
 *
 * M4 canonical 收敛：旧实现依赖的 toDateString 及其整条依赖链
 * （toStringDate/parseStringDate/getYearWeek/getYearDay/getMonthWeek/
 * getWhatYear/Month/Week/padStart）此前为本文件私有移植，现已完整下沉至
 * internal/datetime（canonical 版本并补齐了旧 toDateString 的 options 自定义
 * 模板分支），本文件改为直接导入，消除双份实现。
 */
import { toDateString } from '../internal/datetime'

/**
 * 比较两个日期
 *
 * 双方按 format（缺省为全局配置 formatString，即 'yyyy-MM-dd HH:mm:ss'）
 * 格式化为字符串后比较；任一入参为 falsy 直接 false；
 * 任一日期非法（格式化为 'Invalid Date'）false。
 *
 * @param date1 日期
 * @param date2 日期
 * @param format 对比格式
 * @returns 相同为 true
 */
export function isDateSame(
  date1: string | number | Date,
  date2: string | number | Date,
  format?: string
): boolean {
  if (date1 && date2) {
    const ds1 = toDateString(date1, format)
    return ds1 !== 'Invalid Date' && ds1 === toDateString(date2, format)
  }
  return false
}
