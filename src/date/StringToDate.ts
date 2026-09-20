/**
 * 字符串转换成日期（移植自旧 src/date/StringToDate.js）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/date/StringToDate.json：
 * - 仅接受通过 isDateString/isDateTime 校验的串，内部 `-` 替换为 `/` 后交
 *   new Date 解析（原生斜杠解析按本地时区）；
 * - 解析结果非法或入参不合法返回 false（不抛错）。
 * 导出名保留大写开头（旧版 API 兼容）。
 */
import { isDateTime } from './isDateTime'
import { isDateString } from './isDateString'

/** 连字符替换正则（顶层预编译，replace 不受 lastIndex 影响） */
const dashRE = /-/g

/**
 * 字符串转换成日期
 *
 * @param value 日期串（yyyy-MM-dd 或 yyyy-MM-dd HH:mm:ss）
 * @returns 日期对象；不合法返回 false
 */
export function StringToDate(value: string): Date | false {
  if (isDateString(value) || isDateTime(value)) {
    const stateDate = new Date(value.replace(dashRE, '/'))
    if (stateDate.toString() !== 'Invalid Date') {
      return stateDate
    }
  }
  return false
}
