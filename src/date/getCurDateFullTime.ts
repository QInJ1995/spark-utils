/**
 * 获取当前时间 YYYY-MM-DD HH:MM:SS.sss（移植自旧 src/date/getCurDateFullTime.js）
 */
import { baseGetCurDateTime } from './baseGetCurDateTime'

/**
 * 获取当前时间 YYYY-MM-DD HH:MM:SS.sss
 *
 * @returns 当前日期时间串（含毫秒，本地时区）
 */
export function getCurDateFullTime(): string {
  const d = new Date()
  let ret = baseGetCurDateTime(d)
  ret += ('00' + d.getSeconds()).slice(-2) + '.'
  ret += ('00' + d.getMilliseconds()).slice(-3)
  return ret
}
