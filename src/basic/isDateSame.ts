/**
 * 比较两个日期是否相同（旧 src/basic/isDateSame.js）
 *
 * 私有移植说明：
 * - 旧实现依赖 src/date/toDateString.js（进而依赖 toStringDate、getYearWeek、
 *   getYearDay、getMonthWeek、getWhatYear/Month/Week、padStart、setupDefaults）。
 *   这些属于 date/string 主包域，basic 禁止横向引用（dep-cruiser），internal 层
 *   亦未导出，故在此私有移植，M3 date 模块落地后收敛为正式导入。
 * - 旧 toDateString 的 options 参数（自定义格式化模板）与 setupDefaults.
 *   formatStringMatchs 在 isDateSame 的两参调用形态下恒为空：
 *   formats 最终为 {}，handleCustomTemplate 退化为恒等（直接返回原值），
 *   故按“恒空形态”内联，不移植模板分支。
 * - 已复用 internal 层等价原子：helperGetUTCDateTime/helperGetYMDTime/
 *   staticDayTime/staticWeekTime（datetime）、helperStringRepeat（string）、
 *   getSetup（config，默认格式串）。
 * - 格式化 token 分发由旧实现的闭包工厂（每次调用构建约 25 个闭包 + 映射表）
 *   改写为 switch：match + match.length 到输出的纯映射，行为逐字一致
 *   （含 SS/OO/YYY 等 token 不在映射表中原样保留的怪癖）。
 */
import { getSetup } from '../internal/config'
import {
  helperGetUTCDateTime,
  helperGetYMDTime,
  staticDayTime,
  staticWeekTime,
} from '../internal/datetime'
import { helperStringRepeat } from '../internal/string'
import { isDate, isNumber, isString, isValidDate } from '../internal/type'

/**
 * 比较两个日期
 *
 * 双方按 format（缺省为全局配置 formatString，即 'yyyy-MM-dd HH:mm:ss'）
 * 格式化为字符串后比较；任一入参为 falsy 直接 false；
 * 任一日期非法（格式化为 'Invalid Date'）false。
 *
 * @param date1 日期
 * @param date2 日期
 * @param format 对比格式
 * @returns 相同为 true
 */
export function isDateSame(
  date1: string | number | Date,
  date2: string | number | Date,
  format?: string
): boolean {
  if (date1 && date2) {
    const ds1 = toDateString(date1, format)
    return ds1 !== 'Invalid Date' && ds1 === toDateString(date2, format)
  }
  return false
}

/* ---------------------------------------------------------------------------
 * 以下为私有移植：toDateString 及其依赖（仅本文件内使用，不导出）
 * ------------------------------------------------------------------------- */

/** 旧 toDateString.js 的 dateFormatRE（转义 [] 与全部格式 token） */
const dateFormatRE =
  /\[([^\]]+)]|Y{2,4}|y{2,4}|M{1,2}|d{1,2}|D{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|S{1,3}|Z{1,2}|w{1,2}|W{1,2}|O{1,3}|[aAeEQq]/g

/** 旧 getWhatYear/getWhatMonth 的年初/年末标识（staticStrFirst/staticStrLast） */
const staticStrFirst = 'first'
const staticStrLast = 'last'

/**
 * 日期格式化为字符串，转义符号 []（旧 src/date/toDateString.js 的恒空模板形态）
 *
 * @param date 日期或数字
 * @param format 输出日期格式（年份(yy|yyyy)、月份(M|MM 自动补 0)、天(d|dd 自动补 0)、
 * 12 小时制(h|hh 自动补 0)、24 小时制(H|HH 自动补 0)、分钟(m|mm 自动补 0)、秒(s|ss 自动补 0)、
 * 毫秒(SSS|S)、O 当年的第几天、a/A 上午下午、e/E 星期几、w 当年的第几周、W 当月的第几周、
 * q 当年第几个季度、Z 时区）
 */
function toDateString(date: unknown, format?: string): string {
  if (date) {
    const currentDate = toStringDate(date)
    if (isValidDate(currentDate)) {
      const result = format || getSetup().formatString
      const hours = currentDate.getHours()
      const apm = hours < 12 ? 'am' : 'pm'
      return result.replace(dateFormatRE, (match: string, skip?: string): string => {
        if (skip) {
          return skip
        }
        const length = match.length
        switch (match) {
          case 'yyyy':
          case 'YYYY':
          case 'yy':
          case 'YY':
            return ('' + currentDate.getFullYear()).substring(4 - length)
          case 'MM':
          case 'M':
            return padStart(currentDate.getMonth() + 1, length, '0')
          case 'dd':
          case 'DD':
          case 'd':
          case 'D':
            return padStart(currentDate.getDate(), length, '0')
          case 'HH':
          case 'H':
            return padStart(hours, length, '0')
          case 'hh':
          case 'h':
            return padStart(hours <= 12 ? hours : hours - 12, length, '0')
          case 'mm':
          case 'm':
            return padStart(currentDate.getMinutes(), length, '0')
          case 'ss':
          case 's':
            return padStart(currentDate.getSeconds(), length, '0')
          case 'SSS':
          case 'S':
            return padStart(currentDate.getMilliseconds(), length, '0')
          case 'ZZ':
          case 'Z': {
            const zoneHours = (currentDate.getTimezoneOffset() / 60) * -1
            return (
              (zoneHours >= 0 ? '+' : '-') +
              padStart(zoneHours, 2, '0') +
              (length === 1 ? ':' : '') +
              '00'
            )
          }
          case 'w':
          case 'ww':
            return padStart(getYearWeek(currentDate), length, '0')
          case 'W':
          case 'WW':
            return padStart(getMonthWeek(currentDate), length, '0')
          case 'OOO':
          case 'O':
            return padStart(getYearDay(currentDate), length, '0')
          case 'a':
            return apm
          case 'A':
            return apm.toUpperCase()
          case 'e':
            return '' + currentDate.getDay()
          case 'E':
            return '' + (currentDate.getDay() === 0 ? 7 : currentDate.getDay())
          case 'Q':
          case 'q':
            return '' + Math.floor((currentDate.getMonth() + 3) / 3)
          default:
            return match
        }
      })
    }
    return 'Invalid Date'
  }
  return ''
}

/**
 * 用指定字符从前面开始补全字符串（旧 src/string/padStart.js 的 私有移植）
 *
 * @param str 字符串
 * @param targetLength 结果长度
 * @param padString 补全字符
 */
function padStart(str: string | number, targetLength: number, padString?: string): string {
  const rest = '' + str
  let length = targetLength >> 0
  let pad = padString === undefined ? ' ' : '' + padString
  if (rest.padStart) {
    return rest.padStart(length, pad)
  }
  if (length > rest.length) {
    length -= rest.length
    if (length > pad.length) {
      pad += helperStringRepeat(pad, length / pad.length)
    }
    return pad.substring(0, length) + rest
  }
  return rest
}

/**
 * 返回某个年份的第几周（旧 src/date/getYearWeek.js 的私有移植）
 *
 * @param date 日期或数字
 * @returns 第几周（非法日期 NaN）
 */
function getYearWeek(date: unknown): number {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    currentDate.setHours(0, 0, 0, 0)
    currentDate.setDate(currentDate.getDate() + 3 - (currentDate.getDay() + 6) % 7)
    const week = new Date(currentDate.getFullYear(), 0, 4)
    return (
      Math.round(
        ((currentDate.getTime() - week.getTime()) / staticDayTime + (week.getDay() + 6) % 7 - 3) / 7
      ) + 1
    )
  }
  return NaN
}

/**
 * 返回某个年份的第几天（旧 src/date/getYearDay.js 的私有移植）
 *
 * @param date 日期或数字
 * @returns 第几天（非法日期 NaN）
 */
function getYearDay(date: unknown): number {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    return (
      Math.floor(
        (helperGetYMDTime(currentDate) - helperGetYMDTime(getWhatYear(currentDate, 0, staticStrFirst))) /
          staticDayTime
      ) + 1
    )
  }
  return NaN
}

/**
 * 返回某个月的第几周（旧 src/date/getMonthWeek.js 的私有移植）
 *
 * @param date 日期或数字
 * @returns 第几周（非法日期 NaN）
 */
function getMonthWeek(date: unknown): number {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    const monthFirst = getWhatMonth(currentDate, 0, staticStrFirst)
    let monthFirstWeek = getWhatWeek(monthFirst, 0, 1)
    if (monthFirstWeek.getTime() < monthFirst.getTime()) {
      monthFirstWeek = getWhatWeek(monthFirst, 1, 1)
    }
    if (currentDate.getTime() >= monthFirstWeek.getTime()) {
      return (
        Math.floor(
          (helperGetYMDTime(currentDate) - helperGetYMDTime(monthFirstWeek)) / staticWeekTime
        ) + 1
      )
    }
    return getMonthWeek(getWhatWeek(currentDate, 0, 1))
  }
  return NaN
}

/**
 * 返回前几年或后几年的日期（旧 src/date/getWhatYear.js 的私有移植）
 *
 * @param date 日期或数字
 * @param year 年偏移（默认当前年）
 * @param month 获取哪月（first 年初、last 年末、指定月份 0-11）
 */
function getWhatYear(date: unknown, year: number, month?: number | string): Date {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    if (year) {
      const number = year && !Number.isNaN(year) ? year : 0
      currentDate.setFullYear(currentDate.getFullYear() + number)
    }
    if (month || !Number.isNaN(Number(month))) {
      if (month === staticStrFirst) {
        return new Date(currentDate.getFullYear(), 0, 1)
      } else if (month === staticStrLast) {
        currentDate.setMonth(11)
        return getWhatMonth(currentDate, 0, staticStrLast)
      } else {
        currentDate.setMonth(month as number)
      }
    }
  }
  return currentDate
}

/**
 * 返回前几月或后几月的日期（旧 src/date/getWhatMonth.js 的私有移植）
 *
 * @param date 日期或数字
 * @param month 月偏移（默认当前月）
 * @param day 获取哪天（first 月初、last 月末、指定天数；指定天数被跨月时默认单月最后一天）
 */
function getWhatMonth(date: unknown, month: number, day?: number | string): Date {
  const monthOffset = month && !Number.isNaN(month) ? month : 0
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    if (day === staticStrFirst) {
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1)
    } else if (day === staticStrLast) {
      return new Date(getWhatMonth(currentDate, monthOffset + 1, staticStrFirst).getTime() - 1)
    } else if (isNumber(day)) {
      currentDate.setDate(day)
    }
    if (monthOffset) {
      const currDate = currentDate.getDate()
      currentDate.setMonth(currentDate.getMonth() + monthOffset)
      if (currDate !== currentDate.getDate()) {
        // 当为指定天数，且被跨月了，则默认单月最后一天
        currentDate.setDate(1)
        return new Date(currentDate.getTime() - staticDayTime)
      }
    }
  }
  return currentDate
}

/**
 * 返回前几周或后几周的星期几（旧 src/date/getWhatWeek.js 的私有移植）
 *
 * @param date 日期
 * @param week 周偏移（默认当前周）
 * @param day 星期天（默认 0）、星期一（1）…星期六（6）
 */
function getWhatWeek(date: unknown, week: number, day: number | string): Date {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    const customDay = parseInt(/^[0-7]$/.test(String(day)) ? String(day) : String(currentDate.getDay()), 10)
    const currentDay = currentDate.getDay()
    const time = currentDate.getTime()
    let whatDayTime =
      time + ((customDay === 0 ? 7 : customDay) - (currentDay === 0 ? 7 : currentDay)) * staticDayTime
    if (week && !Number.isNaN(week)) {
      whatDayTime += week * staticWeekTime
    }
    return new Date(whatDayTime)
  }
  return currentDate
}

/* ---------------------------------------------------------------------------
 * toStringDate 私有移植（与 internal/type/guards.ts 的 isLeapYear 私有移植同源，
 * M3 date 模块落地后收敛）
 * ------------------------------------------------------------------------- */

/** 旧 toStringDate.js 的 dateFormatRules */
interface DateParseRule {
  rules: ReadonlyArray<readonly [string, number]>
  offset?: number
}

const dateFormatRules: readonly DateParseRule[] = [
  { rules: [['yyyy', 4], ['YYYY', 4]] },
  { rules: [['MM', 2], ['M', 1]], offset: -1 },
  { rules: [['DD', 2], ['dd', 2], ['d', 1]] },
  { rules: [['HH', 2], ['H', 1]] },
  { rules: [['mm', 2], ['m', 1]] },
  { rules: [['ss', 2], ['s', 1]] },
  { rules: [['SSS', 3], ['S', 1]] },
  { rules: [['ZZ', 5], ['Z', 6], ['Z', 5], ['Z', 1]] },
]

/** 旧 toStringDate.js 的 parseStringDate */
function parseStringDate(str: string, format: string): Array<string | number> {
  const dates: Array<string | number> = [0, 0, 1, 0, 0, 0, 0]
  let datesIndex = 0
  for (const fItem of dateFormatRules) {
    const rules = fItem.rules
    let ruleIndex = 0
    for (const arr of rules) {
      const sIndex = format.indexOf(arr[0])
      if (sIndex > -1) {
        const sub = str.substring(sIndex, sIndex + arr[1])
        if (sub && sub.length === arr[1]) {
          let tempMatch: string | number = sub
          if (fItem.offset) {
            tempMatch = parseInt(sub) + fItem.offset
          }
          dates[datesIndex] = tempMatch
          break
        }
      }
      if (ruleIndex === rules.length - 1) {
        return dates
      }
      ruleIndex++
    }
    datesIndex++
  }
  return dates
}

/**
 * 日期字符串转为日期（旧 src/date/toStringDate.js 的私有移植）
 *
 * 忠实旧语义：Date/时间戳字符串直接构造；其余字符串按 format
 * （缺省为全局配置 formatDate）解析；解析失败返回 Invalid Date。
 */
function toStringDate(str: unknown, format?: string): Date {
  let rest: Date | undefined
  if (str) {
    const isDType = isDate(str)
    if (isDType || (!format && /^[0-9]{11,15}$/.test(String(str)))) {
      rest = new Date(isDType ? (str as Date).getTime() : parseInt(String(str)))
    } else if (isString(str)) {
      const dates = parseStringDate(str, format || getSetup().formatDate)
      const zStr = dates[7]
      if (dates[0]) {
        // 解析时区
        if (zStr) {
          // 如果为UTC 时间
          const zChar = (zStr as string)[0]
          if (zChar === 'z' || zChar === 'Z') {
            rest = new Date(helperGetUTCDateTime(dates))
          } else {
            // 如果指定时区，时区转换
            const tempMatch = (zStr as string).match(/([-+]{1})(\d{2}):?(\d{2})/)
            if (tempMatch) {
              rest = new Date(
                helperGetUTCDateTime(dates) -
                  (tempMatch[1] === '-' ? -1 : 1) * parseInt(tempMatch[2] as string) * 3600000 +
                  parseInt(tempMatch[3] as string) * 60000
              )
            }
          }
        } else {
          rest = new Date(
            dates[0] as number,
            dates[1] as number,
            dates[2] as number,
            dates[3] as number,
            dates[4] as number,
            dates[5] as number,
            dates[6] as number
          )
        }
      }
    }
  }
  return rest ? rest : new Date('')
}
