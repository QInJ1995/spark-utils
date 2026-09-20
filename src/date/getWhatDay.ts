/**
 * 返回前几天或后几天的日期（移植自旧 src/date/getWhatDay.js）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/date/getWhatDay.json：
 * - 偏移量缺省（isNaN 判定不通过）时原样返回（保留时分秒）；
 * - mode 为 first 返回当日零点、last 返回当日 23:59:59.999。
 */
import {
  helperGetDateFullYear,
  helperGetDateMonth,
  helperGetDateTime,
  staticStrFirst,
  staticStrLast,
  toStringDate,
} from '../internal/datetime'
import { isValidDate } from '../internal/type'

/**
 * 返回前几天或后几天的日期
 *
 * @param date 日期或数字
 * @param day 天偏移（默认当天）、前几天、后几天
 * @param mode 获取时分秒（缺省当前时分秒）、日初（first）、日末（last）
 * @returns 偏移后的日期（非法输入返回 Invalid Date）
 */
export function getWhatDay(date: unknown, day?: number, mode?: string): Date {
  const currentDate = toStringDate(date)
  // 旧实现 !isNaN(day) 为全局强转语义：undefined/非数值不通过，原样返回
  if (isValidDate(currentDate) && !Number.isNaN(Number(day))) {
    currentDate.setDate(currentDate.getDate() + parseInt(String(day), 10))
    if (mode === staticStrFirst) {
      return new Date(helperGetDateFullYear(currentDate), helperGetDateMonth(currentDate), currentDate.getDate())
    } else if (mode === staticStrLast) {
      return new Date(helperGetDateTime(getWhatDay(currentDate, 1, staticStrFirst)) - 1)
    }
  }
  return currentDate
}
