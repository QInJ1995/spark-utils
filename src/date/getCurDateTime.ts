/**
 * 获取当前时间 YYYY-MM-DD HH:MM:SS（移植自旧 src/date/getCurDateTime.js）
 */
import { baseGetCurDateTime } from './baseGetCurDateTime'

/**
 * 获取当前时间 YYYY-MM-DD HH:MM:SS
 *
 * @returns 当前日期时间串（本地时区）
 */
export function getCurDateTime(): string {
  const d = new Date()
  let ret = baseGetCurDateTime(d)
  ret += ('00' + d.getSeconds()).slice(-2)
  return ret
}
