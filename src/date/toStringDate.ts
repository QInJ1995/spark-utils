/**
 * 字符串转为日期（旧 src/date/toStringDate.js）
 *
 * 实现于 M4 canonical 下沉至 internal/datetime（与 basic.isDateSame 共用，
 * 含 parseStringDate 按位截取机制与时区分支），本文件为域出口 re-export。
 * 行为基准见 test/fixtures/date/toStringDate.json。
 */
export { toStringDate } from '../internal/datetime'
