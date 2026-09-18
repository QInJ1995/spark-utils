/**
 * 判断是否为日期时间格式（移植自旧 src/date/isDateTime.js）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/date/isDateTime.json：
 * - 仅接受 `yyyy-MM-dd HH:mm:ss` 形态（总长 19，单空格分隔）；
 * - T 分隔等 ISO 形态不符合内部约定，返回 false；
 * - 数字等无 length 入参不抛错，直接 false。
 */
import { isDateString } from './isDateString'
import { isTime } from './isTime'

/**
 * 判断是否为日期时间格式
 *
 * @param dateval 目标串（yyyy-MM-dd HH:mm:ss）
 * @returns 是日期时间格式返回 true
 */
export function isDateTime(dateval: string): boolean {
  if (dateval.length !== 19) {
    return false
  }
  const arr = dateval.split(' ')
  const datePart = arr[0]
  if (datePart === undefined || !isDateString(datePart)) {
    return false
  }
  // 日期段合法（10 位）时总长 19 必含时间段，此取值不会缺位
  return isTime(arr[1] as string)
}
