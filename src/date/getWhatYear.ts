/**
 * 返回前几年或后几年的日期（旧 src/date/getWhatYear.js）
 *
 * 实现于 M4 canonical 下沉至 internal/datetime（toDateString 年初/年末 token
 * 依赖链），本文件为域出口 re-export。行为基准见 test/fixtures/date/getWhatYear.json。
 */
export { getWhatYear } from '../internal/datetime'
