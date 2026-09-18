/**
 * array 模块 2.0 修复回归（fixtures 只锁旧版能跑通的基线，旧版自身崩溃的
 * bug 场景在此补正向断言；对应 overrides.json 登记的有意变更同此原则）
 */
import { describe, expect, it } from 'vitest'
import { toArrayTree } from '../../src/array/toArrayTree'

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
