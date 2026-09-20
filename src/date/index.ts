/**
 * date 模块入口（2.0 TS 重写，M4）
 *
 * 具名导出 25 个方法。内部化不导出：
 * - isDateString（isDateTime/StringToDate/dateDiff 的内部依赖，旧版亦未导出）；
 * - baseGetCurDateTime（getCurDateTime/getCurDateFullTime 的公共前缀）。
 *
 * 2.0 API 变更：
 * - dateDiff + getDateDiff 合并为 dateDiff(start, end, opts)（详见 ./dateDiff.ts
 *   文件头；旧 getDateDiff 经 test/mappings.ts 映射为 { detailed: true } 形态）；
 * - moment 桥接 8 方法不再提供（moment/getMoment/stringToMoment/
 *   stringArrayToMomentArray/momentToString/momentArrayToStringArray/
 *   dateToMoment/momentToDate）——dateToString 改用 dayjs 实现，token 语义不变。
 * - 解析/格式化 canonical 链（toStringDate/toDateString/getWhatYear/Month/Week/
 *   getYearWeek/getYearDay/getMonthWeek）下沉于 internal/datetime，
 *   此处为域出口 re-export。
 */
export { isTime } from './isTime'
export { isDateTime } from './isDateTime'
export { getCurDate } from './getCurDate'
export { getCurDateMonth } from './getCurDateMonth'
export { getCurDateTime } from './getCurDateTime'
export { getCurDateFullTime } from './getCurDateFullTime'
export { getCurQuarter } from './getCurQuarter'
export { getCurIssue } from './getCurIssue'
export { getCurDateYear } from './getCurDateYear'
export { StringToDate } from './StringToDate'
export { dateDiff } from './dateDiff'
export type { DateDiffOptions, DateDiffResult, DateDiffUnit } from './dateDiff'
export { now } from './now'
export { timestamp } from './timestamp'
export { toStringDate } from './toStringDate'
export { toDateString } from './toDateString'
export type { DateTokenTemplate, ToDateStringOptions } from '../internal/datetime'
export { getWhatYear } from './getWhatYear'
export { getWhatMonth } from './getWhatMonth'
export { getWhatWeek } from './getWhatWeek'
export { getWhatDay } from './getWhatDay'
export { getDayOfYear } from './getDayOfYear'
export { getYearDay } from './getYearDay'
export { getYearWeek } from './getYearWeek'
export { getMonthWeek } from './getMonthWeek'
export { getDayOfMonth } from './getDayOfMonth'
export { dateToString } from './dateToString'
