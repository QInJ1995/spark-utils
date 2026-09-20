/**
 * 返回前几月或后几月的日期（旧 src/date/getWhatMonth.js）
 *
 * 实现于 M4 canonical 下沉至 internal/datetime（getWhatYear/getDayOfMonth/
 * getMonthWeek 依赖链），本文件为域出口 re-export。
 * 行为基准见 test/fixtures/date/getWhatMonth.json。
 */
export { getWhatMonth } from '../internal/datetime'
