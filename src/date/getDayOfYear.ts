/**
 * 返回某个年份的天数（移植自旧 src/date/getDayOfYear.js）
 *
 * 行为与旧版一致，见 test/fixtures/date/getDayOfYear.json：
 * 闰年 366、平年 365；year 偏移先经 getWhatYear 生效再判定。
 */
import { getWhatYear, isLeapYear, toStringDate } from '../internal/datetime'
import { isValidDate } from '../internal/type'

/**
 * 返回某个年份的天数
 *
 * @param date 日期或数字
 * @param year 年偏移（默认当年）、前几个年、后几个年
 * @returns 天数（非法输入 NaN）
 */
export function getDayOfYear(date: unknown, year?: number): number {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    return isLeapYear(getWhatYear(currentDate, year)) ? 366 : 365
  }
  return NaN
}
