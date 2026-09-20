/**
 * 返回某个年份的第几周（旧 src/date/getYearWeek.js，ISO 周算法）
 *
 * 实现于 M4 canonical 下沉至 internal/datetime（toDateString 的 w token 依赖），
 * 本文件为域出口 re-export。行为基准见 test/fixtures/date/getYearWeek.json。
 */
export { getYearWeek } from '../internal/datetime'
