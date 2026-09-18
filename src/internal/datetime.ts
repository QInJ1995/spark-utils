/**
 * 日期时间内部原子操作与 canonical 解析/格式化链
 *
 * 第一部分（L0 原子，无内部依赖）移植自旧版：
 * - src/helpers/helperNewDate.js
 * - src/helpers/helperGetYMD.js / helperGetYMDTime.js
 * - src/helpers/helperGetDateFullYear.js / helperGetDateMonth.js / helperGetDateTime.js
 * - src/helpers/helperGetUTCDateTime.js
 * - src/constant/static/staticDayTime.js / staticWeekTime.js / staticStrFirst.js / staticStrLast.js
 *
 * 第二部分（M4 canonical 下沉）为旧 src/date 域解析/格式化链的完整移植：
 * - src/date/toStringDate.js（含 parseStringDate 按位截取机制）
 * - src/date/toDateString.js（含 token 映射与自定义模板机制）
 * - 及其依赖 getWhatYear/getWhatMonth/getWhatWeek/getYearWeek/getYearDay/getMonthWeek
 * 下沉原因：basic.isDateSame 与 date 域共用同一条链，避免各自私有移植产生分叉；
 * isDateSame 的恒空模板形态私有链已删除，统一改由本文件导入。
 *
 * 分层约束：本文件只允许依赖 internal（config/string/type），不得依赖任何域模块
 * （src/basic、src/date 等）；行为（含怪癖）与旧版逐字一致，由
 * test/fixtures/date/*.json 与 test/fixtures/basic/isDateSame.json 回归锁定。
 */
import { getSetup } from './config'
import { helperStringRepeat } from './string'
import { isArray, isDate, isFunction, isNumber, isString, isValidDate } from './type'

/** 一天的毫秒数（旧 staticDayTime） */
export const staticDayTime = 86400000

/** 一周的毫秒数（旧 staticWeekTime，由 staticDayTime 派生） */
export const staticWeekTime = staticDayTime * 7

/** 年初标识（旧 staticStrFirst） */
export const staticStrFirst = 'first'

/** 年末标识（旧 staticStrLast） */
export const staticStrLast = 'last'

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

/* ---------------------------------------------------------------------------
 * toStringDate：字符串解析为日期（canonical，自旧 src/date/toStringDate.js 下沉）
 * ------------------------------------------------------------------------- */

/** 旧 toStringDate.js 的 dateFormatRules（按位截取规则：token → 截取长度，月带 -1 偏移） */
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

/**
 * 按格式串逐组截取日期片段（旧 toStringDate.js 的 parseStringDate）。
 *
 * 忠实旧机制：以 format 中 token 的 indexOf 位置到 str 同位置截取定长片段；
 * 月份做 -1 偏移；任一组全部候选 token 截取失败（截空）即提前返回已解析前缀，
 * 其余位保持初值 [0, 0, 1, 0, 0, 0, 0]。
 */
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
 * 字符串转为日期（canonical，自旧 src/date/toStringDate.js 下沉）
 *
 * 忠实旧语义：
 * - Date 与时间戳字符串（不传 format 且匹配 /^[0-9]{11,15}$/）直接构造；
 * - 其余字符串按 format（缺省为全局配置 formatDate）经 parseStringDate 解析；
 * - 解析结果带时区片段（z/Z 或 ±hh:mm）时按 UTC/偏移换算，否则按本地时区构造；
 * - 不校验日历合法性（月份 13 进位到次年 1 月是既有怪癖）；
 * - 解析失败（含 falsy 入参）返回 Invalid Date。
 *
 * @param str 日期或数字
 * @param format 解析日期格式（yyyy年份、MM月份、dd天、HH小时、mm分钟、ss秒、SSS毫秒、Z时区）
 */
export function toStringDate(str: unknown, format?: string): Date {
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
                  parseInt(tempMatch[3] as string) * 60000,
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
            dates[6] as number,
          )
        }
      }
    }
  }
  return rest ? rest : new Date('')
}

/* ---------------------------------------------------------------------------
 * getWhatYear / getWhatMonth / getWhatWeek / getYearWeek / getYearDay / getMonthWeek
 * （canonical，自旧 src/date 同名文件下沉，为 toDateString 的 w/W/O token 依赖）
 * ------------------------------------------------------------------------- */

/**
 * 返回前几年或后几年的日期（旧 src/date/getWhatYear.js）
 *
 * @param date 日期或数字
 * @param year 年偏移（默认当前年）
 * @param month 获取哪月（first 年初、last 年末、指定月份 0-11）
 * @returns 偏移后的日期（非法输入返回 Invalid Date）
 */
export function getWhatYear(date: unknown, year?: number, month?: number | string): Date {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    if (year) {
      const offset = !Number.isNaN(year) ? year : 0
      currentDate.setFullYear(helperGetDateFullYear(currentDate) + offset)
    }
    if (month || !Number.isNaN(Number(month))) {
      if (month === staticStrFirst) {
        return new Date(helperGetDateFullYear(currentDate), 0, 1)
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
 * 返回前几月或后几月的日期（旧 src/date/getWhatMonth.js）
 *
 * @param date 日期或数字
 * @param month 月偏移（默认当前月）
 * @param day 获取哪天（first 月初、last 月末、指定天数；指定天数被跨月时默认单月最后一天）
 * @returns 偏移后的日期（非法输入返回 Invalid Date）
 */
export function getWhatMonth(date: unknown, month?: number, day?: number | string): Date {
  const monthOffset = month && !Number.isNaN(month) ? month : 0
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    if (day === staticStrFirst) {
      return new Date(helperGetDateFullYear(currentDate), helperGetDateMonth(currentDate) + monthOffset, 1)
    } else if (day === staticStrLast) {
      return new Date(helperGetDateTime(getWhatMonth(currentDate, monthOffset + 1, staticStrFirst)) - 1)
    } else if (isNumber(day)) {
      currentDate.setDate(day)
    }
    if (monthOffset) {
      const currDate = currentDate.getDate()
      currentDate.setMonth(helperGetDateMonth(currentDate) + monthOffset)
      if (currDate !== currentDate.getDate()) {
        // 当为指定天数，且被跨月了，则默认单月最后一天
        currentDate.setDate(1)
        return new Date(helperGetDateTime(currentDate) - staticDayTime)
      }
    }
  }
  return currentDate
}

/** 星期有效值探测（旧 getWhatWeek 内联正则，顶层预编译） */
const whatWeekDayRE = /^[0-7]$/

/**
 * 返回前几周或后几周的星期几（旧 src/date/getWhatWeek.js）
 *
 * @param date 日期或数字
 * @param week 周偏移（默认当前周）
 * @param day 星期天（0，怪癖：按 7 处理取下一个周日）、星期一（1）…星期六（6）
 * @returns 偏移后的日期（非法输入返回 Invalid Date）
 */
export function getWhatWeek(date: unknown, week?: number, day?: number | string): Date {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    const customDay = parseInt(
      whatWeekDayRE.test(String(day)) ? String(day) : String(currentDate.getDay()),
      10,
    )
    const currentDay = currentDate.getDay()
    const time = helperGetDateTime(currentDate)
    let whatDayTime =
      time + ((customDay === 0 ? 7 : customDay) - (currentDay === 0 ? 7 : currentDay)) * staticDayTime
    if (week && !Number.isNaN(week)) {
      whatDayTime += week * staticWeekTime
    }
    return new Date(whatDayTime)
  }
  return currentDate
}

/**
 * 返回某个年份的第几周（旧 src/date/getYearWeek.js，ISO 周算法）
 *
 * @param date 日期或数字
 * @returns 第几周（非法日期 NaN）
 */
export function getYearWeek(date: unknown): number {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    currentDate.setHours(0, 0, 0, 0)
    currentDate.setDate(currentDate.getDate() + 3 - (currentDate.getDay() + 6) % 7)
    const week = new Date(currentDate.getFullYear(), 0, 4)
    return (
      Math.round(
        ((currentDate.getTime() - week.getTime()) / staticDayTime + (week.getDay() + 6) % 7 - 3) / 7,
      ) + 1
    )
  }
  return NaN
}

/**
 * 返回某个年份的第几天（旧 src/date/getYearDay.js）
 *
 * @param date 日期或数字
 * @returns 第几天（非法日期 NaN）
 */
export function getYearDay(date: unknown): number {
  const currentDate = toStringDate(date)
  if (isValidDate(currentDate)) {
    return (
      Math.floor(
        (helperGetYMDTime(currentDate) - helperGetYMDTime(getWhatYear(currentDate, 0, staticStrFirst))) /
          staticDayTime,
      ) + 1
    )
  }
  return NaN
}

/**
 * 返回某个月的第几周（旧 src/date/getMonthWeek.js，周一为周首）
 *
 * 怪癖忠实保留：月初几天若早于首个完整周一，递归回落到上一月计算
 * （如 2024-03-01 返回 2 月的第 4 周）。
 *
 * @param date 日期或数字
 * @returns 第几周（非法日期 NaN）
 */
export function getMonthWeek(date: unknown): number {
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
          (helperGetYMDTime(currentDate) - helperGetYMDTime(monthFirstWeek)) / staticWeekTime,
        ) + 1
      )
    }
    return getMonthWeek(getWhatWeek(currentDate, 0, 1))
  }
  return NaN
}

/* ---------------------------------------------------------------------------
 * toDateString：日期格式化为字符串（canonical，自旧 src/date/toDateString.js 下沉）
 * ------------------------------------------------------------------------- */

/**
 * 自定义格式化模板的单个取值形态（旧 options.formats[token] 的值）：
 * - 映射对象：按值取键（如 { am: '上午', pm: '下午' }）；
 * - 数组：按数值下标取项（如星期/月份文案表）；
 * - 函数：(value, match, date) => string 自定义转换。
 */
export type DateTokenTemplate =
  | Readonly<Record<string, string>>
  | readonly string[]
  | ((value: string | number, match: string, date: Date) => string)

/** toDateString 的自定义格式化选项（旧 options 参数） */
export interface ToDateStringOptions {
  /** 自定义格式化模板：token → 取值数组/映射或转换函数（仅 Z/w/W/O/a/A/e/E/Q/q 生效） */
  formats?: Readonly<Record<string, DateTokenTemplate>>
}

/** 旧 toDateString.js 的 dateFormatRE（转义 [] 与全部格式 token；仅映射表内 token 被替换） */
const dateFormatRE =
  /\[([^\]]+)]|Y{2,4}|y{2,4}|M{1,2}|d{1,2}|D{1,2}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|S{1,3}|Z{1,2}|w{1,2}|W{1,2}|O{1,3}|[aAeEQq]/g

/**
 * 自定义模板分发（旧 toDateString.js 的 handleCustomTemplate）
 *
 * 模板存在时：函数模板以 (value, match, date) 调用，数组/映射模板以值为键取项
 * （越界/缺键返回 undefined，与旧版一致）；模板不存在时原值返回。
 */
function handleCustomTemplate(
  date: Date,
  formats: Record<string, DateTokenTemplate>,
  match: string,
  value: string | number,
): string | number | undefined {
  const format = formats[match]
  if (format) {
    if (isFunction(format)) {
      return format(value, match, date)
    }
    if (isArray(format)) {
      // 数组模板：按数值下标取项（越界返回 undefined，与旧版一致）
      return (format as readonly string[])[value as number]
    }
    return (format as Readonly<Record<string, string>>)[value as string]
  }
  return value
}

/**
 * 用指定字符从前面开始补全字符串（旧 src/string/padStart.js 的私有移植）
 *
 * 与旧版取串语义一致：null/undefined 归 ''（toValueString 行为），其余 `'' + 值`。
 *
 * @param str 字符串
 * @param targetLength 结果长度
 * @param padString 补全字符
 */
function padStart(str: string | number | undefined, targetLength: number, padString?: string): string {
  const rest = str === null || str === undefined ? '' : '' + str
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

/** 星期几转为 ISO 序号（周日 0 → 7，旧 toDateString.js 的 formatDayE） */
function formatDayE(day: number): number {
  return day === 0 ? 7 : day
}

/**
 * 日期格式化为字符串，转义符号 []（canonical，自旧 src/date/toDateString.js 下沉）
 *
 * token 分发为旧实现 parseDates 映射表的 switch 等价改写（闭包工厂 → 纯映射），
 * 含未映射 token（SS/OO/YYY 等）原样保留的怪癖；Z/w/W/O/a/A/e/E/Q/q 额外经过
 * 自定义模板（options.formats，缺省恒空——旧 setupDefaults 无 formatStringMatchs）。
 *
 * @param date 日期或数字
 * @param format 输出日期格式（年份(yy|yyyy)、月份(M|MM 自动补 0)、天(d|dd 自动补 0)、
 * 12 小时制(h|hh 自动补 0)、24 小时制(H|HH 自动补 0)、分钟(m|mm 自动补 0)、秒(s|ss 自动补 0)、
 * 毫秒(SSS|S)、O 当年的第几天、a/A 上午下午、e/E 星期几、w 当年的第几周、W 当月的第几周、
 * q 当年第几个季度、Z 时区）
 * @param options 自定义格式化模板
 */
export function toDateString(date: unknown, format?: string, options?: ToDateStringOptions): string {
  if (date) {
    const currentDate = toStringDate(date)
    if (isValidDate(currentDate)) {
      const result = format || getSetup().formatString
      const hours = currentDate.getHours()
      const apm = hours < 12 ? 'am' : 'pm'
      // 旧实现 assign({}, setupDefaults.formatStringMatchs, options?.formats ?? null)：
      // 旧配置无 formatStringMatchs（恒 undefined 源），等效于 formats 的浅拷贝
      const formats: Record<string, DateTokenTemplate> = { ...(options?.formats ?? {}) }
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
            return ('' + helperGetDateFullYear(currentDate)).substring(4 - length)
          case 'MM':
          case 'M':
            return padStart(helperGetDateMonth(currentDate) + 1, length, '0')
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
            return String(
              handleCustomTemplate(
                currentDate,
                formats,
                match,
                (zoneHours >= 0 ? '+' : '-') +
                  padStart(zoneHours, 2, '0') +
                  (length === 1 ? ':' : '') +
                  '00',
              ),
            )
          }
          case 'w':
          case 'ww':
            return padStart(
              handleCustomTemplate(currentDate, formats, match, getYearWeek(currentDate)),
              length,
              '0',
            )
          case 'W':
          case 'WW':
            return padStart(
              handleCustomTemplate(currentDate, formats, match, getMonthWeek(currentDate)),
              length,
              '0',
            )
          case 'OOO':
          case 'O':
            return padStart(
              handleCustomTemplate(currentDate, formats, match, getYearDay(currentDate)),
              length,
              '0',
            )
          case 'a':
            return String(handleCustomTemplate(currentDate, formats, match, apm))
          case 'A':
            return String(handleCustomTemplate(currentDate, formats, match, apm.toUpperCase()))
          case 'e':
            return String(handleCustomTemplate(currentDate, formats, match, currentDate.getDay()))
          case 'E':
            return String(
              handleCustomTemplate(currentDate, formats, match, formatDayE(currentDate.getDay())),
            )
          case 'Q':
          case 'q':
            return String(
              handleCustomTemplate(
                currentDate,
                formats,
                match,
                Math.floor((helperGetDateMonth(currentDate) + 3) / 3),
              ),
            )
          default:
            return match
        }
      })
    }
    return 'Invalid Date'
  }
  return ''
}
