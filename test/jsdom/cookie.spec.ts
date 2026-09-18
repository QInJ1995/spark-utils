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

  it('单位串过期（1h）同样落 expires', () => {
    const writeSpy = vi.spyOn(document, 'cookie', 'set')
    expect(cookie('cu_hour', 'v', { expires: '1h' })).toBe(true)
    expect(document.cookie).toContain('cu_hour=v')
    expect(writeSpy.mock.calls[0]?.[0] ?? '').toMatch(/cu_hour=v; expires=[A-Za-z]+, /)
    writeSpy.mockRestore()
  })

  it('负单位串立即过期（等价删除）', () => {
    cookie('cu_neg', 'v')
    cookie('cu_neg', 'v', { expires: '-1h' })
    expect(cookie('cu_neg')).toBeUndefined()
  })

  it('过去的时间戳直接过期', () => {
    cookie('cu_ts', 'v', { expires: 1000000000000 })
    expect(cookie('cu_ts')).toBeUndefined()
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

  it('getToken 默认读取 XSRF-TOKEN，未命中返回空串', () => {
    expect(getToken()).toBe('')
    cookie('XSRF-TOKEN', 'tok-1')
    expect(getToken()).toBe('tok-1')
    expect(getToken('cu_other')).toBe('')
  })
})
