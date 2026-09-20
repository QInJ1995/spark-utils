/**
 * array 模块 2.0 修复回归（fixtures 只锁旧版能跑通的基线，旧版自身崩溃的
 * bug 场景在此补正向断言；对应 overrides.json 登记的有意变更同此原则）
 */
import { describe, expect, it } from 'vitest'
import { every } from '../../src/array/every'
import { find } from '../../src/array/find'
import { toArrayTree } from '../../src/array/toArrayTree'

describe('every / find 的对象迭代与无原生方法兜底路径', () => {
  it('对象入参 for-in 逐自有键判定（含假值短路）', () => {
    expect(every({ a: 2, b: 3 }, (v) => v > 1)).toBe(true)
    expect(every({ a: 1, b: 2 }, (v) => v > 1)).toBe(false)
    expect(find({ a: 1, b: 2 }, (v) => v === 2)).toBe(2)
    expect(find({ a: 1, b: 2 }, (v) => v === 3)).toBeUndefined()
  })

  it('空入参：every 返回 true、find 返回 undefined（与 fixture 锁定语义一致）', () => {
    expect(every(null, () => false)).toBe(true)
    expect(find(null, () => true)).toBeUndefined()
  })

  it('数组剥离 Array.prototype 后无 every/find，走索引兜底循环', () => {
    const bareEvery = ['a', 'b']
    Object.setPrototypeOf(bareEvery, Object.prototype)
    expect((bareEvery as { every?: unknown }).every).toBeUndefined()
    expect(every(bareEvery, (v) => typeof v === 'string')).toBe(true)
    expect(every(bareEvery, (v) => v === 'a')).toBe(false)

    const bareFind = ['x', 'y']
    Object.setPrototypeOf(bareFind, Object.prototype)
    expect((bareFind as { find?: unknown }).find).toBeUndefined()
    expect(find(bareFind, (v) => v === 'y')).toBe('y')
    expect(find(bareFind, (v) => v === 'z')).toBeUndefined()
  })

  it('context 作为回调 this', () => {
    const ctx = { limit: 3 }
    expect(
      every(
        [1, 2],
        function (v) {
          return v < (this as { limit: number }).limit
        },
        ctx,
      ),
    ).toBe(true)
  })
})

describe('toArrayTree 2.0 修复', () => {
  it('null/undefined 输入 + sortKey 不再抛 "list is not iterable"，返回 []', () => {
    expect(toArrayTree(null, { sortKey: 'id' })).toEqual([])
    expect(toArrayTree(undefined, { sortKey: 'id', reverse: true })).toEqual([])
  })

  it('sortKey 排序语义不变且不改入参', () => {
    const input = [
      { id: 2, parentId: null },
      { id: 1, parentId: null },
    ]
    const tree = toArrayTree(input, { sortKey: 'id' }) as { id: number }[]
    expect(tree.map((n) => n.id)).toEqual([1, 2])
    // orderBy 返回新数组，入参顺序保持原样
    expect(input.map((n) => n.id)).toEqual([2, 1])
  })
})
