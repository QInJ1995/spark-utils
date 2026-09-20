/**
 * basic 模块补测（批次⑦）：fixtures 排除或分支未覆盖的导出
 * - property：取值函数工厂（null 回落 defs、undefined 按旧语义抛 TypeError）；
 * - uniqueId：模块级自增计数器（fixtures 排除——全局态无稳定基线，做相对断言）；
 * - isMatch：键未包含时回退整体深比较、数组键路径、空 source 恒真；
 * - isEqualWith：自定义函数非函数时退化为 isEqual（分支兜底）。
 */
import { describe, expect, it } from 'vitest'
import { isEqualWith, type EqualCustomizer } from '../../src/basic/isEqualWith'
import { isMatch } from '../../src/basic/isMatch'
import { property } from '../../src/basic/property'
import { uniqueId } from '../../src/basic/uniqueId'

describe('property 取值函数工厂', () => {
  it('按属性名取值；缺键返回 undefined；obj 为 null 返回 defs', () => {
    const getName = property('name', 'anonymous')
    expect(getName({ name: 'spark' })).toBe('spark')
    expect(getName({})).toBeUndefined()
    expect(getName(null)).toBe('anonymous')
  })

  it('undefined 入参按旧语义抛 TypeError（不拦截）', () => {
    const getName = property('name')
    expect(() => getName(undefined)).toThrow(TypeError)
  })
})

describe('uniqueId 全局自增标识', () => {
  it('连续调用严格递增；前缀直接拼接；无前缀为纯数字串', () => {
    const first = uniqueId('batch7_')
    const second = uniqueId('batch7_')
    const third = uniqueId()
    expect(second).not.toBe(first)
    expect(Number(second.slice('batch7_'.length))).toBe(Number(first.slice('batch7_'.length)) + 1)
    expect(third).toMatch(/^\d+$/)
    expect(typeof third).toBe('string')
  })
})

describe('isMatch 键值包含判定', () => {
  it('键数组包含时逐键深度比较', () => {
    expect(isMatch({ a: 1, b: 2 }, { a: 1 })).toBe(true)
    expect(isMatch({ a: 1, b: 2 }, { a: 2 })).toBe(false)
    expect(isMatch({ a: { x: 1, y: 2 } }, { a: { x: 1 } })).toBe(false) // 值为整体深比较，非部分匹配
  })

  it('键未包含时回退整体深比较；空 source 恒真', () => {
    expect(isMatch({ a: 1 }, { b: 2 })).toBe(false) // 键不包含 → isEqual 整体比较
    expect(isMatch([1, 2], [1, 2])).toBe(true) // 数组键 ['0','1'] 相互包含，值相等
    expect(isMatch(5, {})).toBe(true) // sourceKeys 为空恒真
    expect(isMatch(null, { a: 1 })).toBe(false)
  })
})

describe('isEqualWith 自定义比较兜底', () => {
  it('自定义函数返回 undefined 时交回默认严格相等', () => {
    const customizer: EqualCustomizer = (v1, v2) => (typeof v1 === 'string' ? v1.length === (v2 as string).length : undefined)
    expect(isEqualWith('abc', 'xyz', customizer)).toBe(true) // 字符串按长度
    expect(isEqualWith('abc', 'wxyz', customizer)).toBe(false)
    expect(isEqualWith({ a: 1 }, { a: 1 }, customizer)).toBe(true) // undefined 回落深比较
  })

  it('func 不是函数时退化为 isEqual', () => {
    const notAFunction = 42 as unknown as EqualCustomizer
    expect(isEqualWith({ a: 1 }, { a: 1 }, notAFunction)).toBe(true)
    expect(isEqualWith({ a: 1 }, { a: 2 }, notAFunction)).toBe(false)
  })
})
