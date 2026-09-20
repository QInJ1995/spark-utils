/**
 * internal 层冒烟测试（M2 internal 单测起点）
 *
 * 锁定 L0 原子操作的核心行为，期望值均按旧版（v1.1.10）实现核对：
 * - helperNewDate('2024-03-05')：ISO 纯日期按 UTC 零点解析，即 Date.UTC(2024, 2, 5)
 * - helperNumberAdd(0.1, 0.2)：精度修正加法，返回 number 0.3（而非 0.30000000000000004）
 */
import { describe, it, expect } from 'vitest'
import {
  helperNewDate,
  helperGetYMD,
  helperGetYMDTime,
  helperGetDateFullYear,
  helperGetDateMonth,
  helperGetDateTime,
  helperGetUTCDateTime,
  staticDayTime,
  staticWeekTime,
} from '../../src/internal/datetime'
import {
  helperNumberAdd,
  helperNumberDivide,
  helperNumberDecimal,
  helperNumberOffsetPoint,
} from '../../src/internal/number'
import {
  helperStringRepeat,
  helperStringSubstring,
  helperStringLowerCase,
  helperStringUpperCase,
  escapeMap,
  unescapeMap,
  formatEscaper,
} from '../../src/internal/string'
import {
  browse,
  clientBrowser,
  clientScreenSize,
  clientSystem,
  getBrowserInfo,
  isChrome,
  isFireFox,
  isSafari,
} from '../../src/browser/ua'

describe('internal/datetime', () => {
  it('helperNewDate 解析 ISO 日期串（UTC 零点），缺省取当前时间', () => {
    expect(helperNewDate('2024-03-05').getTime()).toBe(1709596800000)
    expect(Math.abs(helperNewDate().getTime() - Date.now())).toBeLessThan(1000)
  })

  it('helperGetYMD 截取年月日（本地时区零点），helperGetYMDTime 取其时间戳', () => {
    const ymd = helperGetYMD(new Date(2024, 2, 5, 10, 20, 30))
    expect(helperGetDateFullYear(ymd)).toBe(2024)
    expect(helperGetDateMonth(ymd)).toBe(2)
    expect(ymd.getDate()).toBe(5)
    expect(helperGetYMDTime(new Date(2024, 2, 5, 10, 20, 30))).toBe(new Date(2024, 2, 5).getTime())
  })

  it('helperGetDateTime / helperGetUTCDateTime / 时间常量', () => {
    expect(helperGetDateTime(new Date(2024, 2, 5))).toBe(new Date(2024, 2, 5).getTime())
    expect(helperGetUTCDateTime([2024, 2, 5, 0, 0, 0, 0])).toBe(1709596800000)
    // 旧实现固定传 7 个参数给 Date.UTC，缺失位为 undefined → NaN（非参数缺省默认值）
    expect(Number.isNaN(helperGetUTCDateTime([2024, 2]))).toBe(true)
    expect(staticDayTime).toBe(86400000)
    expect(staticWeekTime).toBe(604800000)
  })
})

describe('internal/number', () => {
  it('helperNumberAdd 精度修正：0.1 + 0.2 === 0.3（返回 number 而非字符串）', () => {
    const sum = helperNumberAdd(0.1, 0.2)
    expect(typeof sum).toBe('number')
    expect(sum).toBe(0.3)
    expect(helperNumberAdd(1.1, 2.2)).toBe(3.3)
  })

  it('helperNumberDivide 精度修正：0.3 / 0.1 === 3', () => {
    expect(helperNumberDivide(0.3, 0.1)).toBe(3)
  })

  it('helperNumberDecimal / helperNumberOffsetPoint', () => {
    expect(helperNumberDecimal('0.123')).toBe(3)
    expect(helperNumberDecimal('100')).toBe(0)
    expect(helperNumberOffsetPoint('123', 2)).toBe('12.3')
  })
})

describe('internal/string', () => {
  it('helperStringRepeat / helperStringSubstring / 大小写转换', () => {
    expect(helperStringRepeat('a', 3)).toBe('aaa')
    expect(helperStringRepeat('ab', 0)).toBe('')
    expect(helperStringSubstring('hello world', 0, 5)).toBe('hello')
    expect(helperStringLowerCase('AbC')).toBe('abc')
    expect(helperStringUpperCase('aBc')).toBe('ABC')
  })

  it('escapeMap/unescapeMap 经 formatEscaper 工厂往返（与旧版 fixture 一致）', () => {
    const escape = formatEscaper(escapeMap)
    const unescape = formatEscaper(unescapeMap)
    const raw = "<a href=\"#\" class='x'>&`</a>"
    const escaped = '&lt;a href=&quot;#&quot; class=&#x27;x&#x27;&gt;&amp;&#x60;&lt;/a&gt;'
    expect(escape(raw)).toBe(escaped)
    expect(unescape(escaped)).toBe(raw)
  })

  it('转义怪癖与旧版一致：二次转义、单次解码、非字符串取串', () => {
    const escape = formatEscaper(escapeMap)
    const unescape = formatEscaper(unescapeMap)
    expect(escape('&lt;')).toBe('&amp;lt;')
    expect(unescape('&amp;lt;')).toBe('&lt;')
    expect(escape(123)).toBe('123')
    expect(escape(null)).toBe('')
    expect(unescape(undefined)).toBe('')
  })
})

describe('browser/ua 纯 Node 回退（批次⑦补测：惰性 env 探测的无窗口分支）', () => {
  it('browse 返回 { isNode: true } 基础标记，浏览器专属键全缺省', () => {
    const info = browse()
    expect(info.isNode).toBe(true)
    expect(info.isMobile).toBe(false)
    expect(info.isPC).toBe(false)
    expect(info.isDoc).toBe(false)
    expect('isLocalStorage' in info).toBe(false)
  })

  it('getBrowserInfo / clientBrowser 未命中任何 UA 规则 → UNKNOWN', () => {
    expect(getBrowserInfo()).toEqual({ browser: 'UNKNOWN', version: '' })
    expect(clientBrowser()).toBe('UNKNOWN')
  })

  it('clientSystem / clientScreenSize 无窗口回退 UNKNOWN 与空串', () => {
    expect(clientSystem()).toBe('UNKNOWN')
    expect(clientScreenSize()).toBe('')
  })

  it('isChrome / isFireFox / isSafari 空串 UA 恒 false', () => {
    expect(isChrome()).toBe(false)
    expect(isFireFox()).toBe(false)
    expect(isSafari()).toBe(false)
  })
})
