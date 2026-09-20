/**
 * 时间差计算（2.0 API 合并：旧 dateDiff + 旧 getDateDiff → dateDiff）
 *
 * - 旧 dateDiff(start, end, unit)：字符串单位求整数差值（默认秒）。
 *   新形态 dateDiff(start, end, { unit })；旧第三参直接传字符串单位的调用
 *   形态仍兼容（fixtures:dateDiff.json 锁定该形态行为）。
 * - 旧 getDateDiff(start, end, rules)：按规则返回差值明细对象。
 *   新形态 dateDiff(start, end, { detailed: true })，自定义规则经 opts.rules
 *   传入（对应 test/mappings.ts 的 'date.getDateDiff' 映射，
 *   fixtures:getDateDiff.json 锁定行为）。
 * - 单位语义沿用旧 dateDiff：'s' 秒、'n' 分钟（旧名）、'h' 小时、'd' 天、
 *   'w' 周、'M' 月（自然月差）、'y' 年（自然年差）；2.0 增补 'm' 作为分钟的
 *   规范名（与 'n' 等价；旧版 'm' 未映射会落入默认秒，属命名疏漏，非既有语义）。
 */
import { getSetup } from '../internal/config'
import { helperNewDate, helperGetDateTime, toStringDate } from '../internal/datetime'
import { isValidDate } from '../internal/type'
import { StringToDate } from './StringToDate'

/** 差值单位：'s' 秒、'n'/'m' 分钟、'h' 小时、'd' 天、'w' 周、'M' 月、'y' 年 */
export type DateDiffUnit = 's' | 'n' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'

/** dateDiff 选项（detailed 为真时走旧 getDateDiff 明细路径，否则走旧 dateDiff 单位路径） */
export interface DateDiffOptions {
  /** 差值单位（缺省按秒，与旧 dateDiff 默认一致） */
  unit?: DateDiffUnit
  /** 返回差值明细对象（旧 getDateDiff 行为） */
  detailed?: boolean
  /** 明细模式的自定义换算规则（旧 getDateDiff 第三参 rules：[规则名, 毫秒数] 二元组列表） */
  rules?: ReadonlyArray<readonly [string, number]>
}

/** 差值明细结果（旧 getDateDiff 返回形态；除 done/time 外的键由规则名展开） */
export interface DateDiffResult {
  /** 结束日期是否晚于开始日期 */
  done: boolean
  /** 毫秒差值 */
  time: number
  /** 各规则单位的差值 */
  [rule: string]: number | boolean
}

/**
 * 计算两个日期的差值
 *
 * 字符串入参先经 StringToDate 转换（不合法时返回 false）；detailed 模式下
 * 结束日期缺省取当前时间，开始/结束非法或结束不晚于开始时返回
 * { done: false, time: 0 }（与旧 getDateDiff 一致）。
 *
 * @param start 开始日期（Date / 时间戳 / 日期串）
 * @param end 结束日期（Date / 时间戳 / 日期串）
 * @param opts 选项对象；兼容旧 dateDiff 的字符串单位第三参
 * @returns 单位模式返回整数差值（或入参非法返回 false）；detailed 模式返回明细对象
 */
export function dateDiff(
  start: string | number | Date | null | undefined,
  end: string | number | Date | null | undefined,
  opts?: DateDiffOptions | DateDiffUnit
): number | false | DateDiffResult {
  const options: DateDiffOptions = typeof opts === 'string' ? { unit: opts } : opts ?? {}

  // 旧 getDateDiff 路径：差值明细对象
  if (options.detailed) {
    const startDate = toStringDate(start)
    const endDate = end ? toStringDate(end) : helperNewDate()
    const result: DateDiffResult = { done: false, time: 0 }
    if (isValidDate(startDate) && isValidDate(endDate)) {
      const startTime = helperGetDateTime(startDate)
      const endTime = helperGetDateTime(endDate)
      if (startTime < endTime) {
        let diffTime = endTime - startTime
        result.time = diffTime
        const rule =
          options.rules && options.rules.length > 0 ? options.rules : getSetup().dateDiffRules
        result.done = true
        for (let index = 0; index < rule.length; index++) {
          const item = rule[index]
          if (item) {
            if (diffTime >= item[1]) {
              if (index === rule.length - 1) {
                result[item[0]] = diffTime || 0
              } else {
                const value = Math.floor(diffTime / item[1])
                result[item[0]] = value
                diffTime -= value * item[1]
              }
            } else {
              result[item[0]] = 0
            }
          }
        }
      }
    }
    return result
  }

  // 旧 dateDiff 路径：按单位求整数差值
  const dtStart = typeof start === 'string' ? StringToDate(start) : start
  const dtEnd = typeof end === 'string' ? StringToDate(end) : end
  if (dtEnd && dtStart) {
    // 旧实现为 (dtEnd - dtStart) 数值强转：Date 取毫秒、数字原样
    const diff =
      (typeof dtEnd === 'number' ? dtEnd : helperGetDateTime(dtEnd)) -
      (typeof dtStart === 'number' ? dtStart : helperGetDateTime(dtStart))
    switch (options.unit) {
      case 's':
        return parseInt(String(diff / 1000))
      case 'n':
      case 'm':
        return parseInt(String(diff / (60 * 1000)))
      case 'h':
        return parseInt(String(diff / (60 * 60 * 1000)))
      case 'd':
        return parseInt(String(diff / (24 * 60 * 60 * 1000)))
      case 'w':
        return parseInt(String(diff / (7 * 24 * 60 * 60 * 1000)))
      case 'M':
        // 自然月差（旧公式原样保留；数字入参无 getMonth，按旧版在此抛 TypeError）
        return (
          (dtEnd as Date).getMonth() +
          1 +
          ((dtEnd as Date).getFullYear() - (dtStart as Date).getFullYear()) * 12 -
          ((dtStart as Date).getMonth() + 1)
        )
      case 'y':
        return (dtEnd as Date).getFullYear() - (dtStart as Date).getFullYear()
      default:
        return parseInt(String(diff / 1000))
    }
  }
  return false
}
