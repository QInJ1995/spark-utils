import { createTreeFunc, type TreeInput, type TreeIterate, type TreeOptions } from '../internal/tree'

/** findTree 命中结果（旧实现返回的字面量形态；T 为节点类型，根层命中时 parent 为 null） */
export interface FindTreeMatch<T = unknown> {
  index: number
  item: T
  path: string[]
  items: T[]
  parent: T | null
  nodes: T[]
}

/**
 * 树查找实现（旧 findTreeItem）：前序深度优先，
 * path 段为字符串索引 + 子级键名（如 ['0', 'children', '0', 'children', '0']）。
 */
function findTreeItem(
  parent: unknown,
  obj: unknown,
  iterate: TreeIterate,
  context: unknown,
  path: string[],
  nodes: unknown[],
  parseChildren: string,
  _opts: TreeOptions
): FindTreeMatch | undefined {
  if (obj) {
    const list = obj as unknown[]
    for (let index = 0, len = list.length; index < len; index++) {
      const item = list[index]
      const paths = path.concat(['' + index])
      const childNodes = nodes.concat([item])
      if (iterate.call(context, item, index, list, paths, parent, childNodes)) {
        return { index, item, path: paths, items: list, parent, nodes: childNodes }
      }
      if (parseChildren && item) {
        const children = (item as Record<string, unknown>)[parseChildren]
        const match = findTreeItem(
          item,
          children,
          iterate,
          context,
          paths.concat([parseChildren]),
          childNodes,
          parseChildren,
          _opts
        )
        if (match) {
          return match
        }
      }
    }
  }
  return undefined
}

const findTreeImpl = createTreeFunc(findTreeItem)

/**
 * 从树结构中查找匹配第一条数据的键、值、路径（移植自旧 src/array/findTree.js）
 *
 * 节点类型 T 从 obj 入参推断，命中结果的 item/items/parent/nodes 均随之类型化。
 *
 * @param obj 对象/数组
 * @param iterate(item, index, items, path, parent, nodes) 回调（truthy 判定）
 * @param options {children: 'children'}
 * @param context 上下文
 * @returns 命中返回 { index, item, path, items, parent, nodes }，未命中返回 undefined
 */
export function findTree<T = unknown>(
  obj: TreeInput<T>,
  iterate: TreeIterate<T, boolean>,
  options?: TreeOptions | null,
  context?: unknown
): FindTreeMatch<T> | undefined {
  return findTreeImpl(obj, iterate, options, context) as FindTreeMatch<T> | undefined
}
