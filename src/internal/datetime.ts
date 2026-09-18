/**
 * 日期时间内部原子操作（L0）
 *
 * 移植自旧版：
 * - src/helpers/helperNewDate.js
 * - src/helpers/helperGetYMD.js / helperGetYMDTime.js
 * - src/helpers/helperGetDateFullYear.js / helperGetDateMonth.js / helperGetDateTime.js
 * - src/helpers/helperGetUTCDateTime.js
 * - src/constant/static/staticDayTime.js / staticWeekTime.js
 *
 * L0 约束：不依赖 internal 其他目录、不依赖旧 src/*.js。
 */

/** 一天的毫秒数（旧 staticDayTime） */
export const staticDayTime = 86400000

/** 一周的毫秒数（旧 staticWeekTime，由 staticDayTime 派生） */
export const staticWeekTime = staticDayTime * 7

/**
 * 创建 Date（旧 helperNewDate）。
 *
 * 旧实现是无参 `new Date()`，旧库所有调用方均不传参。重写版按新签名补充可选
 * value：不传或传 undefined 时与旧行为完全一致（取当前时间）；传入非法值
 * （如 NaN）时按原生语义得到 Invalid Date——不做拦截、不抛错，由调用方通过
 * getTime() 为 NaN 自行判断，与旧库容错风格一致。
 */
export function helperNewDate(value?: string | number | Date): Date {
  return value === undefined ? new Date() : new Date(value)
}

/** 取 Date 的完整年份（旧 helperGetDateFullYear） */
export function helperGetDateFullYear(date: Date): number {
  return date.getFullYear()
}

/** 取 Date 的月份，0-11（旧 helperGetDateMonth） */
export function helperGetDateMonth(date: Date): number {
  return date.getMonth()
}

/** 取 Date 的毫秒时间戳（旧 helperGetDateTime） */
export function helperGetDateTime(date: Date): number {
  return date.getTime()
}

/**
 * 将日期数组按 UTC 语义转为毫秒时间戳（旧 helperGetUTCDateTime）。
 *
 * 与旧实现一致：固定读取第 0-6 位（年、月、日、时、分、秒、毫秒）并显式传给
 * Date.UTC。数组不足 7 位时，缺失位以 undefined 参与 ToNumber 得 NaN，整体
 * 返回 NaN——不会回落到“参数缺省”的默认值（月 0、日 1 等）。该语义被旧版
 * toStringDate 的时区解析分支依赖，须原样保留。元素允许 string（旧版
 * parseStringDate 产出的是字符串片段），由 Date.UTC 原生强制转换。
 */
export function helperGetUTCDateTime(dates: readonly (string | number)[]): number {
  const [year, monthIndex, day, hours, minutes, seconds, ms] = dates
  return Date.UTC(
    year as number,
    monthIndex as number,
    day as number,
    hours as number,
    minutes as number,
    seconds as number,
    ms as number,
  )
}

/**
 * 取日期的年月日部分（时分秒毫秒归零，旧 helperGetYMD）。
 *
 * 本仓库旧实现即 new Date(getFullYear(), getMonth(), getDate())，按本地时区
 * 取当日零点，不依赖 setupDefaults 的 formatDate/formatString 默认值（那是
 * toStringDate 解析层的事），因此签名保持 (date: Date) => Date，无需引入
 * 显式格式串参数。
 */
export function helperGetYMD(date: Date): Date {
  return new Date(helperGetDateFullYear(date), helperGetDateMonth(date), date.getDate())
}

/** 取日期年月日部分（本地时区零点）的毫秒时间戳（旧 helperGetYMDTime） */
export function helperGetYMDTime(date: Date): number {
  return helperGetDateTime(helperGetYMD(date))
}
