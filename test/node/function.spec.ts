/**
 * function 模块测试（M3：TS 重写后行为锁定）
 *
 * 覆盖 noop/delay/once/after/before/throttle/debounce/loop（bind 已在 2.0 删除）。
 * 计时类方法全部经 vi.useFakeTimers + vi.advanceTimersByTime 验证时序。
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as functionModule from '../../src/function/index'

const api: typeof functionModule = functionModule

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('noop', () => {
  it('始终返回 undefined，任意参数均被忽略', () => {
    const { noop } = api
    expect(noop()).toBeUndefined()
    expect(noop(1, 'a', { x: 1 })).toBeUndefined()
  })
})

describe('delay', () => {
  it('wait 毫秒后才执行回调，额外参数原样透传', () => {
    const { delay } = api
    const fn = vi.fn((_a: unknown, _b: unknown) => 'ignored')
    delay(fn, 200, 'x', 1)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(199)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('x', 1)
  })
})

describe('once', () => {
  it('只执行一次，后续调用返回第一次的缓存结果', () => {
    const { once } = api
    let calls = 0
    const fn = once((a: number, b: number) => {
      calls++
      return a + b
    })
    expect(fn(1, 2)).toBe(3)
    expect(fn(10, 20)).toBe(3)
    expect(calls).toBe(1)
  })

  it('创建时的附加参数拼在当次实参之后', () => {
    const { once } = api
    const fn = once((...args: unknown[]) => args.join('-'), undefined, 'a', 'b')
    expect(fn('x')).toBe('x-a-b')
  })
})

describe('after', () => {
  it('前 count 次不执行，自第 count 次起每次都执行（回调收 rests + 当次实参）', () => {
    const { after } = api
    const fn = vi.fn()
    const wrapped = after(2, fn)
    wrapped(1)
    expect(fn).not.toHaveBeenCalled()
    wrapped(2)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith([1, 2], 2)
    wrapped(3)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith([1, 2], 3)
  })
})

describe('before', () => {
  it('仅前 count-1 次执行回调，rests 逐次累积（同一数组引用，快照比对）', () => {
    const { before } = api
    const calls: Array<[unknown[], unknown]> = []
    const wrapped = before(3, (rests: unknown[], first: unknown) => {
      // 旧版每次传入同一个 rests 数组引用，这里快照当时的累积内容
      calls.push([[...rests], first])
    })
    wrapped(1)
    wrapped(2)
    wrapped(3)
    wrapped(4)
    expect(calls).toEqual([
      [[1], 1],
      [[1, 2], 2],
    ])
  })
})

describe('throttle', () => {
  it('默认（不传 options）不立即执行，间隔后以最后一次参数执行一次', () => {
    const { throttle } = api
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled(1)
    throttled(2)
    throttled(3)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(3)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('{leading: true, trailing: true}：立即执行一次，间隔后补一次尾部执行', () => {
    const { throttle } = api
    const fn = vi.fn()
    const throttled = throttle(fn, 100, { leading: true, trailing: true })
    throttled(1)
    expect(fn).toHaveBeenCalledTimes(1)
    throttled(2)
    throttled(3)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith(3)
  })

  it('布尔 true 简写等价 {leading: true}：间隔后不再补执行', () => {
    const { throttle } = api
    const fn = vi.fn()
    const throttled = throttle(fn, 100, true)
    throttled(1)
    expect(fn).toHaveBeenCalledTimes(1)
    throttled(2)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith(1)
  })
})

describe('debounce', () => {
  it('默认（不传 options）静默期后执行一次，重复调用重置计时', () => {
    const { debounce } = api
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced(1)
    vi.advanceTimersByTime(50)
    debounced(2)
    vi.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(2)
  })

  it('{leading: true, trailing: false}：立即执行，静默期后不重复执行', () => {
    const { debounce } = api
    const fn = vi.fn()
    const debounced = debounce(fn, 100, { leading: true, trailing: false })
    debounced(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(1)
    debounced(2)
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('修复回归：不传 options 不再抛 TypeError（旧版缺陷）', () => {
    const { debounce } = api
    expect(() => debounce(() => 1, 100)).not.toThrow()
  })
})

describe('loop', () => {
  it('按 time 间隔循环，回调返回真值后停止', () => {
    const { loop } = api
    let runs = 0
    loop(() => {
      runs++
      return runs >= 3
    }, 100, 10)
    vi.advanceTimersByTime(300)
    expect(runs).toBe(3)
    vi.advanceTimersByTime(1000)
    expect(runs).toBe(3)
  })

  it('回调始终返回假值时，超过 timeout 秒后强制停止', () => {
    const { loop } = api
    let runs = 0
    loop(() => {
      runs++
      return false
    }, 100, 1)
    vi.advanceTimersByTime(5000)
    // 第 11 次循环时 loopTime = 1100ms > 1000ms，随后 clearInterval
    expect(runs).toBe(11)
  })

  it('不传回调时 console.error 提示且不创建定时器', () => {
    const { loop } = api
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    loop(undefined)
    expect(errorSpy).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(5000)
    // 无定时器：不再有副作用（spy 未再被触发即视为未循环）
    expect(errorSpy).toHaveBeenCalledTimes(1)
    errorSpy.mockRestore()
  })
})
