/**
 * array 模块 2.0 修复回归（fixtures 只锁旧版能跑通的基线，旧版自身崩溃的
 * bug 场景在此补正向断言；对应 overrides.json 登记的有意变更同此原则）
 */
import { describe, expect, it } from 'vitest'
import { eachTree } from '../../src/array/eachTree'
import { every } from '../../src/array/every'
import { filterTree } from '../../src/array/filterTree'
import { find } from '../../src/array/find'
import { findTree } from '../../src/array/findTree'
import { mapTree } from '../../src/array/mapTree'
import { searchTree } from '../../src/array/searchTree'
import { toArrayTree } from '../../src/array/toArrayTree'
import { toTreeArray } from '../../src/array/toTreeArray'

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

describe('树族泛型（批次⑥：回调与结果的节点类型推断）', () => {
  interface TreeNode {
    id: number
    children?: TreeNode[]
  }
  const tree: TreeNode[] = [
    { id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] },
    { id: 5 },
  ]

  it('eachTree：item/items/parent/nodes 均按节点类型收窄（根层 parent 为 null）', () => {
    const seen: Array<{ id: number; parent: number | null; siblings: number[] }> = []
    eachTree(tree, (item, _index, items, _path, parent, nodes) => {
      // 以下属性访问依赖泛型收窄（item: TreeNode），由 typecheck 链编译期验证
      seen.push({ id: item.id, parent: parent ? parent.id : null, siblings: items.map((n) => n.id) })
      expect(nodes.every((n) => typeof n.id === 'number')).toBe(true)
    })
    expect(seen.map((s) => s.id)).toEqual([1, 2, 3, 4, 5])
    expect(seen[0]?.parent).toBeNull()
    expect(seen[1]?.parent).toBe(1)
  })

  it('findTree：命中结果的 item/items/parent/nodes 类型化', () => {
    const found = findTree(tree, (item) => item.id === 4)
    expect(found?.item.id).toBe(4)
    expect(found?.parent?.id).toBe(3)
    expect(found?.path).toEqual(['0', 'children', '1', 'children', '0'])
    expect(findTree(tree, (item) => item.id === 9)).toBeUndefined()
  })

  it('mapTree：映射结果类型 R 从回调返回值推断', () => {
    const mapped = mapTree(tree, (item) => ({ v: item.id * 10 }))
    expect(mapped.map((n) => n.v)).toEqual([10, 50])
    // 实现会把递归结果写入 mapChildren 键（默认 children），回调返回类型之外的字段以结构断言读取
    const first = mapped[0] as { v: number; children?: Array<{ v: number }> }
    expect(first.children?.map((n) => n.v)).toEqual([20, 30])
  })

  it('filterTree / searchTree / toTreeArray：返回数组元素类型化', () => {
    const filtered = filterTree(tree, (item) => item.id % 2 === 1)
    expect(filtered.map((n) => n.id)).toEqual([1, 3, 5])

    const searched = searchTree(tree, (item) => item.id === 4)
    // 命中节点 4 的祖先链 1→3 完整保留，命中节点补空 children；其余分支剪掉
    expect(searched.map((n) => n.id)).toEqual([1])
    expect(searched[0]?.children?.map((n) => n.id)).toEqual([3])
    expect(searched[0]?.children?.[0]?.children?.map((n) => n.id)).toEqual([4])
    expect(searched[0]?.children?.[0]?.children?.[0]?.children).toEqual([])

    const flattened = toTreeArray<TreeNode>(tree)
    expect(flattened.map((n) => n.id)).toEqual([1, 2, 3, 4, 5])
  })
})
