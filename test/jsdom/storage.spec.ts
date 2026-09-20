// @vitest-environment jsdom
/**
 * storage 模块（M5）行为测试：webStorage 实例 set/get/remove / 过期 / 缓存失效
 *
 * 缓存设计：实例缓存「原始串 + 解析结果」，自身写路径直改缓存；
 * 外部（其它实例或页面直写 Storage）改动经原始串比对自动失效重解析。
 *
 * 运行说明（M5 过渡期）：import 显式带 .ts 后缀绕开旧 .js 的扩展名遮蔽
 * （见 cookie.spec.ts 头注释），旧 .js 删除后可还原。
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createWebStorage, getStorage, webStorage } from '../../src/browser/storage'

afterEach(() => {
  vi.useRealTimers()
  window.sessionStorage.clear()
  window.localStorage.clear()
})

describe('webStorage set/get/remove', () => {
  it('sessionStorage 写读往返（值经 JSON 透明序列化）', () => {
    const store = createWebStorage('st_a')
    expect(store).not.toBe(false)
    if (store === false) return
    store.set('k1', 1)
    store.set('k2', '文本')
    store.set('k3', { nested: true })
    expect(store.get('k1')).toBe(1)
    expect(store.get('k2')).toBe('文本')
    expect(store.get('k3')).toEqual({ nested: true })
    expect(store.getAllKeys()).toEqual(expect.arrayContaining(['k1', 'k2', 'k3']))
  })

  it('isLocal=true 落在 localStorage，默认落 sessionStorage', () => {
    const local = createWebStorage('st_loc', { isLocal: true })
    const session = createWebStorage('st_sess')
    expect(local).not.toBe(false)
    expect(session).not.toBe(false)
    if (local === false || session === false) return
    local.set('x', 'L')
    session.set('x', 'S')
    expect(window.localStorage.getItem('st_loc')).toContain('L')
    expect(window.sessionStorage.getItem('st_sess')).toContain('S')
    expect(getStorage('st_loc', 'x', true)).toBe('L')
    expect(getStorage('st_sess', 'x')).toBe('S')
  })

  it('remove 删除指定键，removeData 清空整键', () => {
    const store = createWebStorage('st_rm')
    expect(store).not.toBe(false)
    if (store === false) return
    store.set('a', 1)
    store.set('b', 2)
    expect(store.remove('a')).toBe(true)
    expect(store.get('b')).toBe(2)
    store.removeData()
    expect(store.getAll()).toBeNull()
    expect(store.get('gone')).toBeNull()
  })

  it('getAll 返回浅拷贝，外部修改不污染实例缓存', () => {
    const store = createWebStorage('st_copy')
    expect(store).not.toBe(false)
    if (store === false) return
    store.set('a', 1)
    const snapshot = store.getAll()
    expect(snapshot).not.toBeNull()
    if (snapshot !== null) {
      delete snapshot.a
    }
    expect(store.get('a')).toBe(1)
  })
})

describe('webStorage 缓存失效（原始串比对）', () => {
  it('外部直写 Storage 后，实例读取自动重解析', () => {
    const store = createWebStorage('st_ext')
    expect(store).not.toBe(false)
    if (store === false) return
    store.set('mine', 'old')
    // 模拟另一实例/页面绕过本实例直写底层
    window.sessionStorage.setItem('st_ext', JSON.stringify({ external: JSON.stringify('new') }))
    expect(store.get('external')).toBe('new')
    expect(store.get('mine')).toBeNull()
  })
})

describe('webStorage 失效时间（invalidTime）', () => {
  it('超过 invalidTime 的键读取时返回 null 并被删除', () => {
    vi.useFakeTimers()
    const store = createWebStorage('st_exp', { invalidTime: 30 })
    expect(store).not.toBe(false)
    if (store === false) return
    store.set('fresh', 'v')
    expect(store.get('fresh')).toBe('v')
    vi.advanceTimersByTime(60_000)
    expect(store.get('fresh')).toBeNull()
    expect(store.getAllKeys()).not.toContain('fresh')
  })

  it('invalidTime=-1（默认）永不过期', () => {
    vi.useFakeTimers()
    const store = createWebStorage('st_keep')
    expect(store).not.toBe(false)
    if (store === false) return
    store.set('k', 'v')
    vi.advanceTimersByTime(365 * 24 * 3600_000)
    expect(store.get('k')).toBe('v')
  })

  it('cleanFailureData 清理全部过期键', () => {
    vi.useFakeTimers()
    const store = createWebStorage('st_clean', { invalidTime: 30 })
    expect(store).not.toBe(false)
    if (store === false) return
    store.set('old1', 1)
    store.set('old2', 2)
    vi.advanceTimersByTime(60_000)
    store.set('new', 3)
    store.cleanFailureData()
    expect(store.getAllKeys()).toEqual(['new'])
  })
})

describe('webStorage 混用与损坏条目（三态解析）', () => {
  it('过期实例读到普通实例写入的数据：原样返回，不回写不损毁', () => {
    const plain = createWebStorage('st_mix')
    const exp = createWebStorage('st_mix', { invalidTime: 600 })
    expect(plain).not.toBe(false)
    expect(exp).not.toBe(false)
    if (plain === false || exp === false) return
    plain.set('k', 'v')
    // 旧版此处 exp.get 把 undefined 当 updateTime 回写，静默损毁条目
    expect(exp.get('k')).toBe('v')
    const raw = window.sessionStorage.getItem('st_mix') ?? ''
    expect(raw).not.toContain('updateTime')
    // 普通实例视角数据完好
    expect(plain.get('k')).toBe('v')
  })

  it('过期实例写入的数据，普通实例读取时解包返回真实值', () => {
    const exp = createWebStorage('st_unwrap', { invalidTime: 600 })
    expect(exp).not.toBe(false)
    if (exp === false) return
    exp.set('k', { n: 1 })
    const plain = createWebStorage('st_unwrap')
    expect(plain).not.toBe(false)
    if (plain === false) return
    // 旧版返回整个 { value, updateTime } 壳
    expect(plain.get('k')).toEqual({ n: 1 })
  })

  it('损坏 JSON 条目按缺失处理，不再裸抛 SyntaxError', () => {
    window.sessionStorage.setItem(
      'st_corrupt',
      JSON.stringify({ bad: '不是合法JSON', nullEntry: 'null' })
    )
    const store = createWebStorage('st_corrupt', { invalidTime: 600 })
    expect(store).not.toBe(false)
    if (store === false) return
    expect(store.get('bad')).toBeNull()
    expect(store.get('nullEntry')).toBeNull()
    expect(() => store.cleanFailureData()).not.toThrow()
    // 损坏条目保持原样，clean 不动它们
    expect(store.getAllKeys()).toEqual(expect.arrayContaining(['bad', 'nullEntry']))
  })

  it('plain 数据不受过期管辖：过期实例 get/clean 均不删除', () => {
    vi.useFakeTimers()
    // 外部直写 plain 条目（绕过过期实例的包装格式）
    window.sessionStorage.setItem('st_plain', JSON.stringify({ k: JSON.stringify('v') }))
    const exp = createWebStorage('st_plain', { invalidTime: 30 })
    expect(exp).not.toBe(false)
    if (exp === false) return
    vi.advanceTimersByTime(60_000)
    expect(exp.get('k')).toBe('v')
    exp.cleanFailureData()
    expect(exp.getAllKeys()).toContain('k')
  })
})

describe('webStorage 命名空间与 getStorage', () => {
  it('getStorage 不传 key 返回整个映射', () => {
    const store = createWebStorage('st_all')
    expect(store).not.toBe(false)
    if (store === false) return
    store.set('a', 1)
    const all = getStorage('st_all') as Record<string, unknown>
    expect(Object.keys(all)).toContain('a')
  })

  it('webStorage 命名空间聚合 createWebStorage / getStorage', () => {
    expect(typeof webStorage.createWebStorage).toBe('function')
    expect(typeof webStorage.getStorage).toBe('function')
  })
})
