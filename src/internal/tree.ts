/**
 * 树结构迭代选项（移植自 src/helpers/helperCreateTreeFunc.js 的 options 形态）
 */
export interface TreeOptions {
  /** 子节点键名，默认 'children'（缺省/空串回落默认值，忠实旧实现） */
  children?: string
  /** 结果写入的子键名（mapTree 等使用），缺省回落 children */
  mapChildren?: string
  /** 旧实现 options 为任意用户对象，保留附加键的透传能力 */
  [key: string]: unknown
}

/**
 * 树迭代回调形态（eachTree/mapTree 等 handle 内的调用形式）：
 * iterate.call(context, item, index, items, path, parent, nodes)
 */
export type TreeIterate<T = unknown, R = unknown> = (
  this: unknown,
  item: T,
  index: number,
  items: unknown,
  path: string[],
  parent: unknown,
  nodes: T[]
) => R

/**
 * handle 形态（参照 src/array/eachTree.js / src/array/mapTree.js 的 eachTreeItem/mapTreeItem）：
 * (parent, obj, iterate, context, path, node, parseChildren, opts)
 */
export type TreeHandle<R = unknown> = (
  parent: unknown,
  obj: unknown,
  iterate: TreeIterate,
  context: unknown,
  path: string[],
  nodes: unknown[],
  parseChildren: string,
  opts: TreeOptions
) => R

/**
 * 创建树结构迭代方法（移植自 src/helpers/helperCreateTreeFunc.js）
 *
 * 返回 (obj, iterate, options, context)：options 缺省为 {}，
 * children 键缺省/空串回落 'children'，handle 以
 * (null, obj, iterate, context, [], [], optChildren, opts) 形式调用。
 *
 * @param handle 树迭代实现
 */
export function createTreeFunc<R>(
  handle: TreeHandle<R>
): (obj: unknown, iterate: TreeIterate, options?: TreeOptions | null, context?: unknown) => R {
  return function treeFunc(obj, iterate, options, context) {
    const opts = options || {}
    const optChildren = opts.children || 'children'
    return handle(null, obj, iterate, context, [], [], optChildren, opts)
  }
}
