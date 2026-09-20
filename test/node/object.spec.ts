/**
 * object 域补充测试：clone 的深拷贝特殊构造器分支
 *
 * fixtures/object/clone.json 覆盖了普通对象/数组路径；此处补齐
 * handleValueClone 的 Date/RegExp/Set/Map 分支与浅拷贝引用语义
 * （ RegExp 深拷贝走 new ctor(valueOf())——RegExp 未覆写 valueOf，
 * 实际等价 new RegExp(原对象)，source/flags 忠实保持）。
 */
import { describe, expect, it } from 'vitest'
import { clone } from '../../src/object/clone'

describe('object.clone 深拷贝特殊构造器', () => {
  it('Date 深拷贝：时间值相等、引用不同', () => {
    const date = new Date(1700000000000)
    const cloned = clone(date, true) as Date
    expect(cloned).not.toBe(date)
    expect(cloned.getTime()).toBe(date.getTime())
  })

  it('RegExp 深拷贝：source 与 flags 保持', () => {
    const re = /ab/g
    const cloned = clone(re, true) as RegExp
    expect(cloned).not.toBe(re)
    expect(cloned.source).toBe('ab')
    expect(cloned.flags).toBe('g')
  })

  it('Set/Map 深拷贝逐项重建；浅拷贝原样返回同一引用', () => {
    const set = new Set([1, 2])
    const setDeep = clone(set, true) as Set<number>
    expect(setDeep).not.toBe(set)
    expect([...setDeep]).toEqual([1, 2])
    // 非普通对象/数组不走克隆，浅拷贝（deep 未传）原样返回
    expect(clone(set)).toBe(set)

    const map = new Map<string, number>([['a', 1]])
    const mapDeep = clone(map, true) as Map<string, number>
    expect(mapDeep).not.toBe(map)
    expect([...mapDeep]).toEqual([['a', 1]])
    expect(clone(map)).toBe(map)
  })

  it('嵌套在普通对象内的特殊值同样递归处理', () => {
    const inner = new Set([1])
    const cloned = clone({ s: inner }, true) as { s: Set<number> }
    expect(cloned.s).not.toBe(inner)
    expect([...cloned.s]).toEqual([1])
    // 浅拷贝嵌套引用保持
    expect((clone({ s: inner }) as { s: Set<number> }).s).toBe(inner)
  })

  it('falsy 入参原样返回', () => {
    expect(clone(null)).toBe(null)
    expect(clone(0)).toBe(0)
    expect(clone('')).toBe('')
    expect(clone(undefined)).toBe(undefined)
  })
})
