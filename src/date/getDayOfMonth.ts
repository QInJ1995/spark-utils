/**
 * 返回某个月份的天数（移植自旧 src/date/getDayOfMonth.js）
 *
 * 行为与旧版一致，见 test/fixtures/date/getDayOfMonth.json：
 * 月初/月末差 + 1；month 偏移先经 getWhatMonth 生效。
 */
import {
  getWhatMonth,
  helperGetDateTime,
  staticDayTime,
  staticStrFirst,
  staticStrLast,
  toStringDate,
} from '../internal/datetime'
import { isValidDate } from '../internal/type'

/**
 * 返回某个月份的天数
 *
 * @param date 日期或数字
 * @param month 月偏移（默认当月）、前几个月、后几个月
 * @returns 天数（非法输入 NaN）
 */
export function getDayOfMonth(date: unknown, month?: number): number {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    return (
      Math.floor(
        (helperGetDateTime(getWhatMonth(currentDate, month, staticStrLast)) -
          helperGetDateTime(getWhatMonth(currentDate, month, staticStrFirst))) /
          staticDayTime,
      ) + 1
    )
  }
  return NaN
}
