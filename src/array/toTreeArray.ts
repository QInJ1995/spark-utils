import { getSetup } from '../internal/config'
import { each } from '../internal/iterate'

/** toTreeArray 选项（旧 options 形态；children 缺省回落 getSetup().treeOptions） */
export interface ToTreeArrayOptions {
  /** 子级键，默认 'children' */
  children?: string
  /** 数据解包键（设置后节点取 item[data]） */
  data?: string
  /** 展开后删除节点上的子级键（原地变异） */
  clear?: boolean
  /** 旧实现 options 为任意用户对象，保留附加键的透传能力 */
  [key: string]: unknown
}

/**
 * 递归展平（旧 unTreeList）：深度优先先入列再下钻子级；
 * data 键解包在取 children 之后；clear 在入列后删除子级键（原地变异）。
 */
function unTreeList(result: unknown[], array: unknown, opts: Record<string, unknown>): unknown[] {
  const optChildren = opts.children as string
  const optData = opts.data
  const optClear = opts.clear
  each(array, function unTreeListItem(target) {
    let item = target as Record<string, unknown>
    const children = item[optChildren]
    if (optData) {
      item = item[optData as string] as Record<string, unknown>
    }
    result.push(item)
    if (children && (children as unknown[]).length) {
      unTreeList(result, children, opts)
    }
    if (optClear) {
      delete item[optChildren]
    }
  })
  return result
}

/**
 * 将一个树结构转成数组列表（移植自旧 src/array/toTreeArray.js）
 *
 * 选项与 getSetup().treeOptions（旧 setupDefaults.treeOptions）浅合并；
 * 节点类型 T 由调用方标注。
 *
 * @param array 树结构数组
 * @param options 树配置
 * @returns 深度优先展平的数组列表
 */
export function toTreeArray<T = unknown>(
  array: ReadonlyArray<T> | null | undefined,
  options?: ToTreeArrayOptions | null
): T[] {
  return unTreeList([], array, Object.assign({}, getSetup().treeOptions, options) as Record<string, unknown>) as T[]
}
