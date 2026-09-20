/**
 * date 模块（M4 TS 重写）行为测试
 *
 * 覆盖：
 * - now / timestamp（falsy 回退当前时间、解析失败 NaN、自定义 format）；
 * - getCur* 系列：vi.setSystemTime 固定 2024-03-15T02:00:00Z（该瞬间在
 *   UTC 与 Asia/Shanghai 落在同一自然日，避免本机时区差异导致断言漂移），
 *   期望值全部由本地时区构造函数拼装，与运行环境时区无关；
 * - dateDiff 合并 API：旧字符串单位形态 / opts.unit（含 'm' 分钟别名）/
 *   opts.detailed（默认规则、自定义 rules、反向 done:false）/ 非法入参 false；
 * - dateToString：dayjs token（含中文格式）、缺省 ISO+时区偏移输出、
 *   非法输入映射为 moment 兼容的 'Invalid date'；
 * - toStringDate / toDateString 往返一致性。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as dateApi from '../../src/date'

const { now, timestamp, dateDiff, dateToString, toStringDate, toDateString, getCurDate, getCurDateMonth, getCurDateTime, getCurDateFullTime, getCurQuarter, getCurIssue, getCurDateYear } = dateApi

/** 跨时区同一天的固定瞬间：UTC 2024-03-15 02:00 / Asia/Shanghai 2024-03-15 10:00 */
const FIXED = new Date('2024-03-15T02:00:00Z')

const pad2 = (value: number): string => ('00' + value).slice(-2)
const pad3 = (value: number): string => ('00' + value).slice(-3)

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(FIXED)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('date.now / date.timestamp', () => {
  it('now 返回固定时刻的毫秒时间戳', () => {
    expect(now()).toBe(FIXED.getTime())
  })

  it('timestamp 解析日期串为本地零点毫秒值', () => {
    expect(timestamp('2024-03-05')).toBe(new Date(2024, 2, 5).getTime())
  })

  it('timestamp 支持 format 解析', () => {
    expect(timestamp('05/03/2024', 'dd/MM/yyyy')).toBe(new Date(2024, 2, 5).getTime())
  })

  it('timestamp falsy 入参回退 now', () => {
    expect(timestamp()).toBe(FIXED.getTime())
  })

  it('timestamp 解析失败返回 NaN', () => {
    expect(Number.isNaN(timestamp('abc'))).toBe(true)
  })
})

describe('date.getCur* 系列（固定 2024-03-15T02:00:00Z）', () => {
  it('getCurDate / getCurDateMonth / getCurDateYear 输出年月日前缀', () => {
    const d = new Date()
    expect(getCurDate()).toBe(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`)
    expect(getCurDateMonth()).toBe(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}`)
    expect(getCurDateYear()).toBe(`${d.getFullYear()}`)
  })

  it('getCurDateTime / getCurDateFullTime 输出时间与毫秒', () => {
    const d = new Date()
    const datePart = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
    const timePart = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
    expect(getCurDateTime()).toBe(`${datePart} ${timePart}`)
    expect(getCurDateFullTime()).toBe(`${datePart} ${timePart}.${pad3(d.getMilliseconds())}`)
  })

  it('getCurDateTime 与 toDateString 同一时刻格式化一致', () => {
    expect(getCurDateTime()).toBe(toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss'))
  })

  it('getCurIssue / getCurQuarter 输出期号与季度', () => {
    const d = new Date()
    expect(getCurIssue()).toBe(`${d.getFullYear()}${pad2(d.getMonth() + 1)}`)
    const quarter = Math.ceil((d.getMonth() + 1) / 3)
    expect(getCurQuarter()).toBe(`${d.getFullYear()}年${pad2(quarter)}季度`)
  })

  it('getCurQuarter 四个季度分支全覆盖（含边界月）', () => {
    const cases: Array<[string, string]> = [
      ['2024-01-15T00:00:00', '2024年01季度'], // 1 月（季度首）
      ['2024-03-31T23:59:59', '2024年01季度'], // 3 月（季度尾）
      ['2024-04-01T00:00:00', '2024年02季度'],
      ['2024-06-30T12:00:00', '2024年02季度'],
      ['2024-07-15T00:00:00', '2024年03季度'],
      ['2024-09-30T12:00:00', '2024年03季度'],
      ['2024-10-01T00:00:00', '2024年04季度'],
      ['2024-12-31T23:59:59', '2024年04季度'],
    ]
    for (const [iso, expected] of cases) {
      vi.setSystemTime(new Date(iso))
      expect(getCurQuarter(), iso).toBe(expected)
    }
  })
})

describe('date.dateDiff（合并 API）', () => {
  it('旧字符串单位形态与 opts.unit 等价（天）', () => {
    expect(dateDiff('2024-01-01', '2024-03-10', 'd')).toBe(69)
    expect(dateDiff('2024-01-01', '2024-03-10', { unit: 'd' })).toBe(69)
  })

  it('自然月差与分钟单位（含 m 别名）', () => {
    expect(dateDiff('2024-01-15', '2024-03-15', { unit: 'M' })).toBe(2)
    expect(
      dateDiff(new Date('2024-03-05T00:00:00Z'), new Date('2024-03-05T01:30:00Z'), { unit: 'm' }),
    ).toBe(90)
    expect(
      dateDiff(new Date('2024-03-05T00:00:00Z'), new Date('2024-03-05T01:30:00Z'), 'n'),
    ).toBe(90)
  })

  it('detailed 返回旧 getDateDiff 默认规则明细', () => {
    expect(
      dateDiff(new Date('2024-03-05T00:30:00Z'), new Date('2024-03-08T02:00:00Z'), { detailed: true }),
    ).toEqual({ done: true, time: 264600000, yyyy: 0, MM: 0, dd: 3, HH: 1, mm: 30, ss: 0, S: 0 })
  })

  it('detailed + rules 自定义规则与反向 done:false', () => {
    expect(
      dateDiff(new Date('2024-03-05T00:30:00Z'), new Date('2024-03-05T00:30:01.000Z'), {
        detailed: true,
        rules: [['ss', 1000]],
      }),
    ).toEqual({ done: true, time: 1000, ss: 1000 })
    expect(
      dateDiff(new Date('2024-03-08T02:00:00Z'), new Date('2024-03-05T00:30:00Z'), { detailed: true }),
    ).toEqual({ done: false, time: 0 })
  })

  it('非法入参返回 false', () => {
    expect(dateDiff('abc', '2024-01-01', 'd')).toBe(false)
  })
})

describe('date.dateToString（dayjs token）', () => {
  it('常用 token 与中文格式', () => {
    const d = new Date(2024, 2, 5, 8, 30, 0)
    expect(dateToString(d, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-03-05 08:30:00')
    expect(dateToString(d, 'YYYY年MM月DD日')).toBe('2024年03月05日')
  })

  it('不传 format 输出本地时区 ISO 形态（与 moment 默认一致）', () => {
    const d = new Date(2024, 2, 5, 8, 30, 0)
    const offset = -d.getTimezoneOffset()
    const sign = offset >= 0 ? '+' : '-'
    const zone = `${sign}${pad2(Math.floor(Math.abs(offset) / 60))}:${pad2(Math.abs(offset) % 60)}`
    expect(dateToString(d)).toBe(`2024-03-05T08:30:00${zone}`)
  })

  it('非法输入映射为 moment 兼容的 Invalid date', () => {
    expect(dateToString('not-a-date', 'YYYY-MM-DD')).toBe('Invalid date')
  })
})

describe('date.toStringDate / date.toDateString 往返', () => {
  it('默认格式往返一致', () => {
    const src = new Date(2024, 2, 5, 8, 30, 0)
    const str = toDateString(src)
    expect(str).toBe('2024-03-05 08:30:00')
    expect(toStringDate(str).getTime()).toBe(src.getTime())
  })

  it('自定义 format 解析与 w/Q/E token', () => {
    expect(toStringDate('05/03/2024', 'dd/MM/yyyy').getTime()).toBe(new Date(2024, 2, 5).getTime())
    expect(toDateString(new Date(2024, 2, 5, 8, 30, 0), 'yyyy-w-Q-E')).toBe('2024-10-1-2')
  })
})
