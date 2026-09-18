import { getSetup } from '../internal/config'
import { each } from '../internal/iterate'
import { map } from './map'
import { orderBy } from './orderBy'
import { remove } from './remove'

/** toArrayTree 选项（旧 options 形态；键名缺省回落 getSetup().treeOptions） */
export interface ToArrayTreeOptions {
  /** 严格模式：删除空子级键 */
  strict?: boolean
  /** 节点标识键，默认 'id' */
  key?: string
  /** 父节点标识键，默认 'parentId' */
  parentKey?: string
  /** 子级键，默认 'children' */
  children?: string
  /** 预排序键 */
  sortKey?: string
  /** 预排序后反转 */
  reverse?: boolean
  /** 数据包装键（设置后节点挂在 data 下） */
  data?: string
  /** 旧实现 options 为任意用户对象，保留附加键的透传能力 */
  [key: string]: unknown
}

/**
 * 严格模式清理（旧 strictTree）：children 存在且为空数组的节点删除子级键。
 * 怪癖忠实保留：判定读死键 item.children，删除的是配置键 optChildren。
 */
function strictTree(array: unknown, optChildren: string): void {
  each(array, function strictTreeItem(item) {
    const node = item as Record<string, unknown>
    const children = node.children
    if (children && !(children as unknown[]).length) {
      remove(node, optChildren)
    }
  })
}

/**
 * 将一个带层级的数据列表转成树结构（移植自旧 src/array/toArrayTree.js）
 *
 * - 选项与 getSetup().treeOptions（旧 setupDefaults.treeOptions）浅合并；
 * - sortKey 存在时先按其排序（旧 clone(array) 无 deep，等价浅拷贝后排序），
 *   reverse 再反转；
 * - 依 parentKey 挂接子级：treeMap[id] 即该节点的 children 数组（原地写入），
 *   parentId 不在 id 列表的孤儿节点作为根返回；
 * - strict 模式追加 strictTree 清理空 children 键（原地变异）。
 *
 * @param array 数组
 * @param options 树配置
 * @returns 树结构数组
 */
export function toArrayTree(
  array: ReadonlyArray<unknown> | null | undefined,
  options?: ToArrayTreeOptions | null
): unknown[] {
  const opts = Object.assign({}, getSetup().treeOptions, options) as Record<string, unknown>
  const optStrict = opts.strict
  const optKey = opts.key as string
  const optParentKey = opts.parentKey as string
  const optChildren = opts.children as string
  const optSortKey = opts.sortKey
  const optReverse = opts.reverse
  const optData = opts.data
  const result: unknown[] = []
  const treeMap: Record<string, unknown[]> = {}
  let list = array as unknown[] | null | undefined

  if (optSortKey) {
    // orderBy 返回新数组且不改入参（旧版外层浅拷贝 spread 无观测效果，
    // 反而在 array 为 null 时抛 "list is not iterable"——2.0 修复）
    list = orderBy(list, optSortKey as string)
    if (optReverse) {
      list.reverse()
    }
  }

  // 根判定查重表：Set.has 与旧数组 includes 同为 SameValueZero 语义，
  // 逐节点 O(n) 线性扫（整体 O(n²)）收敛为 O(1)
  const idSet = new Set(
    map(list, function pickId(item) {
      return (item as Record<string, unknown>)[optKey]
    })
  )

  each(list, function buildTree(item) {
    const node = item as Record<string, unknown>
    const id = node[optKey]
    let treeData: Record<string, unknown>
    if (optData) {
      treeData = {}
      treeData[optData as string] = item
    } else {
      treeData = node
    }
    const parentId = node[optParentKey]
    const idKey = id as string
    const parentSlotKey = parentId as string
    const idSlots = treeMap[idKey] || []
    treeMap[idKey] = idSlots
    const parentSlots = treeMap[parentSlotKey] || []
    treeMap[parentSlotKey] = parentSlots
    parentSlots.push(treeData)
    treeData[optKey] = id
    treeData[optParentKey] = parentId
    treeData[optChildren] = treeMap[id as string]
    if (!optStrict || (optStrict && !parentId)) {
      // 旧数组 includes（SameValueZero）→ Set.has，语义逐点相同
      if (!idSet.has(parentId)) {
        result.push(treeData)
      }
    }
  })

  if (optStrict) {
    strictTree(list, optChildren)
  }

  return result
}
