/**
 * 返回前几周或后几周的星期几（旧 src/date/getWhatWeek.js）
 *
 * 实现于 M4 canonical 下沉至 internal/datetime（getMonthWeek 依赖链），
 * 本文件为域出口 re-export。行为基准见 test/fixtures/date/getWhatWeek.json。
 */
export { getWhatWeek } from '../internal/datetime'
