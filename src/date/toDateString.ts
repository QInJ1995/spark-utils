/**
 * 日期格式化为字符串，转义符号 []（旧 src/date/toDateString.js）
 *
 * 实现于 M4 canonical 下沉至 internal/datetime（与 basic.isDateSame 共用，
 * 含 token 映射与 options.formats 自定义模板机制），本文件为域出口 re-export。
 * 行为基准见 test/fixtures/date/toDateString.json。
 */
export { toDateString } from '../internal/datetime'
export type { DateTokenTemplate, ToDateStringOptions } from '../internal/datetime'
