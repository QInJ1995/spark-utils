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
 * 根层回调的 parent 为 null；items 为当前层节点列表，nodes 为根到当前节点的路径节点组
 */
export type TreeIterate<T = unknown, R = unknown> = (
  this: unknown,
  item: T,
  index: number,
  items: T[],
  path: string[],
  parent: T | null,
  nodes: T[]
) => R

/**
 * handle 形态（参照 src/array/eachTree.js / src/array/mapTree.js 的 eachTreeItem/mapTreeItem）：
 * (parent, obj, iterate, context, path, nodes, parseChildren, opts)
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

/** 树入参形态：数组树为主（对象树沿用 each 分派的旧形态），T 从此推断到回调与结果 */
export type TreeInput<T> = readonly T[] | Record<string, T> | null | undefined

/**
 * 创建树结构迭代方法（移植自 src/helpers/helperCreateTreeFunc.js）
 *
 * 返回 (obj, iterate, options, context)：options 缺省为 {}，
 * children 键缺省/空串回落 'children'，handle 以
 * (null, obj, iterate, context, [], [], optChildren, opts) 形式调用。
 * 返回函数保持泛型（节点类型 T 从 obj 形参推断，回调参数为逆变位无法自推断），
 * 供 eachTree 等直接对外；需要回调返回值参与结果类型的方法（mapTree 等）另写显式签名包装。
 *
 * @param handle 树迭代实现
 */
export function createTreeFunc<R>(
  handle: TreeHandle<R>
): <T = unknown, IR = unknown>(
  obj: TreeInput<T>,
  iterate: TreeIterate<T, IR>,
  options?: TreeOptions | null,
  context?: unknown
) => R {
  return function treeFunc(obj, iterate, options, context) {
    const opts = options || {}
    const optChildren = opts.children || 'children'
    // 回调按 T 收窄入参，handle 以 unknown 形态消费（协变方向安全，收敛到此一处断言）
    return handle(null, obj, iterate as TreeIterate, context, [], [], optChildren, opts)
  }
}
