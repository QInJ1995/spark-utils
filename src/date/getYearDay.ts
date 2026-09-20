/**
 * 返回某个年份的第几天（旧 src/date/getYearDay.js）
 *
 * 实现于 M4 canonical 下沉至 internal/datetime（toDateString 的 O token 依赖），
 * 本文件为域出口 re-export。行为基准见 test/fixtures/date/getYearDay.json。
 */
export { getYearDay } from '../internal/datetime'
