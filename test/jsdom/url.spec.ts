// @vitest-environment jsdom
/**
 * url 模块（M5）行为测试：parseUrl / serialize / unserialize / objectToUrlParam 往返 /
 * getNowPageParam / getBaseURL / locat（jsdom location 经 env 惰性读取）
 *
 * 运行说明（M5 过渡期）：import 显式带 .ts 后缀绕开旧 .js 的扩展名遮蔽
 * （见 cookie.spec.ts 头注释），旧 .js 删除后可还原。
 */
import { describe, expect, it } from 'vitest'
import {
  getBaseURL,
  getNowPageParam,
  locat,
  objectToUrlParam,
  parseUrl,
  serialize,
  unserialize,
} from '../../src/browser/url'

describe('parseUrl', () => {
  it('完整 URL 各字段', () => {
    const parsed = parseUrl('https://a.b.com:8080/p/q?x=1#h?y=2')
    expect(parsed.href).toBe('https://a.b.com:8080/p/q?x=1#h?y=2')
    expect(parsed.protocol).toBe('https:')
    expect(parsed.hostname).toBe('a.b.com')
    expect(parsed.host).toBe('a.b.com:8080')
    expect(parsed.port).toBe('8080')
    expect(parsed.pathname).toBe('/p/q')
    expect(parsed.search).toBe('?x=1')
    expect(parsed.hash).toBe('#h?y=2')
    expect(parsed.origin).toBe('https://a.b.com:8080')
    expect(parsed.hashKey).toBe('h')
    expect(parsed.searchQuery).toEqual({ x: '1' })
    expect(parsed.hashQuery).toEqual({ y: '2' })
  })

  it('根相对路径补当前 origin（经 env 的 getLocation）', () => {
    const parsed = parseUrl('/a/b?k=1')
    expect(parsed.href).toBe(`${window.location.origin}/a/b?k=1`)
    expect(parsed.origin).toBe(window.location.origin)
  })

  it('协议相对路径补当前协议', () => {
    const parsed = parseUrl('//cdn.example.com/x')
    expect(parsed.href).toBe(`${window.location.protocol}//cdn.example.com/x`)
    expect(parsed.hostname).toBe('cdn.example.com')
  })

  it('无查询与哈希时 search/hash 为空串，query 为空对象', () => {
    const parsed = parseUrl('https://x.com/')
    expect(parsed.search).toBe('')
    expect(parsed.hash).toBe('')
    expect(parsed.searchQuery).toEqual({})
    expect(parsed.hashQuery).toEqual({})
  })
})

describe('serialize / unserialize / objectToUrlParam', () => {
  it('标量、空格转 +、数组与对象括号展开（括号经 URI 编码，旧版如此）', () => {
    expect(serialize({ a: 1, b: 'x y', c: [1, 2], d: { e: 'f' } })).toBe(
      'a=1&b=x+y&c%5B0%5D=1&c%5B1%5D=2&d%5Be%5D=f',
    )
  })

  it('null 输出空值，undefined 顶层跳过', () => {
    expect(serialize({ a: null, b: undefined })).toBe('a=')
    expect(serialize(null)).toBe('')
  })

  it('unserialize 往返（含中文与保留字符；空格怪癖见下）', () => {
    const query = { q: '中文&=', n: '10' }
    expect(unserialize(serialize(query))).toEqual(query)
  })

  it('旧怪癖：空格经 + 编码后 unserialize 不还原（旧版无 + -> 空格处理）', () => {
    expect(serialize({ q: 'a b' })).toBe('q=a+b')
    expect(unserialize('q=a+b')).toEqual({ q: 'a+b' })
  })

  it('unserialize 的旧怪癖：仅取首个 = 后的一段（a=b=c -> a:"b"）', () => {
    expect(unserialize('a=b=c')).toEqual({ a: 'b' })
  })

  it('2.0 修复：非法百分号序列不再抛 URIError，按原串保留', () => {
    expect(unserialize('a=%&b=%E4%B8%AD')).toEqual({ a: '%', b: '中' })
    expect(unserialize('100%')).toEqual({ '100%': '' })
    // parseUrl / getNowPageParam 经 unserialize 收敛，同样不再炸
    expect(() => parseUrl('https://x.example/?k=%')).not.toThrow()
    expect(getNowPageParam('?k=%&ok=1')).toEqual({ k: '%', ok: '1' })
  })

  it('objectToUrlParam 是 serialize 的别名', () => {
    expect(objectToUrlParam({ a: 1, b: [1, 2] })).toBe(serialize({ a: 1, b: [1, 2] }))
  })
})

describe('getNowPageParam / getBaseURL / locat', () => {
  it('按 ? 分段合并参数并解码', () => {
    expect(getNowPageParam('http://h/p?x=%E4%B8%AD&y=1?z=2')).toEqual({ x: '中', y: '1', z: '2' })
  })

  it('段内 #/ 被移除（旧版 replace(/#\\//g) 行为：拼进上一个值）', () => {
    // 'm=1#/r' 去掉 '#/' 后为 'm=1r'，忠实旧版逐段 replace 的怪癖
    expect(getNowPageParam('http://h/p?m=1#/r?n=2')).toEqual({ m: '1r', n: '2' })
  })

  it('getBaseURL 返回当前 origin 到最后一个 / 的路径', () => {
    const base = getBaseURL()
    expect(base.startsWith(window.location.origin)).toBe(true)
    expect(base.endsWith('/')).toBe(true)
  })

  it('locat 解析当前地址栏', () => {
    expect(locat().href).toBe(window.location.href)
    expect(locat().origin).toBe(window.location.origin)
  })
})
