// @vitest-environment jsdom
/**
 * cookie 模块（M5）行为测试：jsdom document.cookie 读写删 / 过期 / 编码 / 兼容别名
 *
 * 两套旧实现（src/browser/cookie.js 与 src/cookie/*.js）合并后的唯一实现
 * 经 encodeURIComponent 编解码；过期支持天数 / 时间戳 / Date / 单位串。
 *
 * 运行说明（M5 过渡期）：src/browser 下旧 .js 与新 .ts 并存，vite 的
 * 扩展名解析顺序（.js 优先）会遮蔽同名 .ts，故 import 显式带 .ts 后缀；
 * 旧 .js 删除（集成阶段）后可还原为无后缀。文件头 @vitest-environment
 * 注解兜底 jsdom 环境（vitest.config 的 jsdom project 未生效时仍可运行）。
 */
import { describe, expect, it, vi } from 'vitest'
import { cookie, getCookie, getToken, setCookie } from '../../src/browser/cookie'

describe('cookie 读写往返', () => {
  it('字符串值写入后可读取', () => {
    expect(cookie('cu_a', '1')).toBe(true)
    expect(cookie('cu_a')).toBe('1')
    expect(document.cookie).toContain('cu_a=1')
  })

  it('中文与特殊字符经 URI 编解码往返', () => {
    expect(cookie('cu_cn', '值 1&=')).toBe(true)
    expect(cookie('cu_cn')).toBe('值 1&=')
  })

  it('对象值自动 JSON 序列化', () => {
    expect(cookie('cu_obj', { x: 1 })).toBe(true)
    expect(cookie('cu_obj')).toBe('{"x":1}')
  })

  it('cookie() 无参读取全部，cookie.keys() / cookie.has()', () => {
    cookie('cu_k1', 'v1')
    cookie('cu_k2', 'v2')
    const all = cookie()
    expect(all.cu_k1).toBe('v1')
    expect(all.cu_k2).toBe('v2')
    expect(cookie.keys()).toEqual(expect.arrayContaining(['cu_k1', 'cu_k2']))
    expect(cookie.has('cu_k1')).toBe(true)
    expect(cookie.has('cu_nope')).toBe(false)
  })
})

describe('cookie 删除与过期', () => {
  it('cookie.remove 写入过去时间使 cookie 失效', () => {
    cookie('cu_rm', 'v')
    expect(cookie('cu_rm')).toBe('v')
    cookie.remove('cu_rm')
    expect(cookie('cu_rm')).toBeUndefined()
  })

  it('天数过期写入 expires 属性（UTC 串）', () => {
    // document.cookie 的 getter 只回显 name=value，经 setter spy 断言属性串
    const writeSpy = vi.spyOn(document, 'cookie', 'set')
    expect(cookie('cu_day', 'v', { expires: 1 })).toBe(true)
    expect(document.cookie).toContain('cu_day=v')
    expect(writeSpy.mock.calls[0]?.[0] ?? '').toMatch(/cu_day=v; expires=[A-Za-z]+, /)
    writeSpy.mockRestore()
  })

  it('单位串过期按各自单位换算时长（不再错落数字天数分支）', () => {
    // '1h' 若漏全局 isNaN 强转会错按 1 天计算——此处断言实际偏移时长
    const cases: Array<[string, number, number]> = [
      // [入参, 期望偏移毫秒, 容差毫秒]
      ['1h', 60 * 60 * 1000, 60 * 1000],
      ['12h', 12 * 60 * 60 * 1000, 60 * 1000],
      ['30m', 30 * 60 * 1000, 60 * 1000],
      ['10s', 10 * 1000, 60 * 1000],
      ['2y', 2 * 365 * 86400000, 2 * 86400000],
      ['2d', 2 * 86400000, 60 * 1000],
      ['1M', 30 * 86400000, 2.5 * 86400000], // 自然月 28-31 天
    ]
    for (const [unit, expectedMs, tolerance] of cases) {
      const writeSpy = vi.spyOn(document, 'cookie', 'set')
      const key = `cu_unit_${unit}`
      expect(cookie(key, 'v', { expires: unit })).toBe(true)
      const written = writeSpy.mock.calls[0]?.[0] ?? ''
      const expiresAttr = /expires=([^;]+)/.exec(written)?.[1] ?? ''
      const delta = Date.parse(expiresAttr) - Date.now()
      expect(delta, `单位串 ${unit} 的偏移 ${delta}ms 应≈${expectedMs}ms`).toBeGreaterThan(expectedMs - tolerance)
      expect(delta).toBeLessThan(expectedMs + tolerance)
      writeSpy.mockRestore()
    }
  })

  it('非单位串（含负号，如 -1h）原样写入属性（忠实旧版 replace 不匹配）', () => {
    const writeSpy = vi.spyOn(document, 'cookie', 'set')
    cookie('cu_neg', 'v', { expires: '-1h' })
    // 旧版 '-1h' 不匹配单位正则，原样写入（浏览器按无效属性忽略 → 会话 cookie）；
    // 删除请用 cookie.remove（数字 -1 天，见上）
    expect(writeSpy.mock.calls[0]?.[0] ?? '').toContain('expires=-1h')
    writeSpy.mockRestore()
  })

  it("'M' 跨月溢出回落上一月末（1-31 + 1M → 2 月最后一天，批次⑦补测）", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 31, 12, 0, 0))
    try {
      const writeSpy = vi.spyOn(document, 'cookie', 'set')
      cookie('cu_feb', 'v', { expires: '1M' })
      const expiresAttr = /expires=([^;]+)/.exec(writeSpy.mock.calls[0]?.[0] ?? '')?.[1] ?? ''
      // 2024-01-31 加一月溢出为 03-02，旧 getWhatMonth 语义回落 02-29（闰年）
      expect(Date.parse(expiresAttr)).toBe(new Date(2024, 1, 29, 12, 0, 0).getTime())
      writeSpy.mockRestore()
    } finally {
      vi.useRealTimers()
    }
  })

  it('数字时间戳 expires 经 new Date 强转 UTC 串写入', () => {
    const writeSpy = vi.spyOn(document, 'cookie', 'set')
    const ts = Date.now() + 3600 * 1000
    cookie('cu_tsfmt', 'v', { expires: ts })
    const written = writeSpy.mock.calls[0]?.[0] ?? ''
    expect(written).toContain(`expires=${new Date(ts).toUTCString()}`)
    writeSpy.mockRestore()
  })

  it('过去的时间戳直接过期', () => {
    cookie('cu_ts', 'v', { expires: 1000000000000 })
    expect(cookie('cu_ts')).toBeUndefined()
  })
})

describe('cookie 多参形态（批次⑦补测：数组批量 / 单对象 / 无名项跳过）', () => {
  it('数组入参逐项写入', () => {
    expect(cookie([{ name: 'cu_b1', value: '1' }, { name: 'cu_b2', value: '2' }])).toBe(true)
    expect(cookie('cu_b1')).toBe('1')
    expect(cookie('cu_b2')).toBe('2')
  })

  it('单对象入参写入', () => {
    expect(cookie({ name: 'cu_obj1', value: '3' })).toBe(true)
    expect(cookie('cu_obj1')).toBe('3')
  })

  it('无名项跳过，有名项正常写入', () => {
    expect(cookie([{ name: '', value: 'x' }, { name: 'cu_ok', value: 'y' }])).toBe(true)
    expect(document.cookie).toContain('cu_ok=y')
    expect(document.cookie).not.toContain('=x')
  })
})

describe('cookie 静态方法族（get / set / remove）', () => {
  it('cookie.set 返回自身可链式；cookie.get 读取；cookie.remove 删除', () => {
    expect(cookie.set('cu_static', 'sv')).toBe(cookie)
    expect(cookie.get('cu_static')).toBe('sv')
    expect(cookie.get('cu_missing')).toBeUndefined()
    cookie.remove('cu_static')
    expect(cookie.get('cu_static')).toBeUndefined()
  })
})

describe('cookie 兼容别名（旧 src/cookie/*.js 签名）', () => {
  it('setCookie 秒级过期 + getCookie 读取', () => {
    const writeSpy = vi.spyOn(document, 'cookie', 'set')
    expect(setCookie('cu_set', 'vv', 3600)).toBe(true)
    expect(document.cookie).toContain('cu_set=vv')
    expect(writeSpy.mock.calls[0]?.[0] ?? '').toMatch(/cu_set=vv; expires=/)
    writeSpy.mockRestore()
    expect(getCookie('cu_set')).toBe('vv')
  })

  it('getCookie 未命中返回 null', () => {
    expect(getCookie('cu_missing')).toBeNull()
  })

  it('setCookie 第四参 path 写入 path 属性', () => {
    const writeSpy = vi.spyOn(document, 'cookie', 'set')
    expect(setCookie('cu_path', 'pv', 0, '/sub')).toBe(true)
    expect(writeSpy.mock.calls[0]?.[0] ?? '').toContain('path=/sub')
    writeSpy.mockRestore()
  })

  it('getToken 默认读取 XSRF-TOKEN，未命中返回空串', () => {
    expect(getToken()).toBe('')
    cookie('XSRF-TOKEN', 'tok-1')
    expect(getToken()).toBe('tok-1')
    expect(getToken('cu_other')).toBe('')
  })
})
