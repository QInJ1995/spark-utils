import { createTreeFunc, type TreeIterate, type TreeOptions } from '../internal/tree'

/** findTree 命中结果（旧实现返回的字面量形态） */
export interface FindTreeMatch {
  index: number
  item: unknown
  path: string[]
  items: unknown
  parent: unknown
  nodes: unknown[]
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

/**
 * 从树结构中查找匹配第一条数据的键、值、路径（移植自旧 src/array/findTree.js）
 *
 * @param obj 对象/数组
 * @param iterate(item, index, items, path, parent, nodes) 回调
 * @param options {children: 'children'}
 * @param context 上下文
 * @returns 命中返回 { index, item, path, items, parent, nodes }，未命中返回 undefined
 */
export const findTree = createTreeFunc(findTreeItem)
