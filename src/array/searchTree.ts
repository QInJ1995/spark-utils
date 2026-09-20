import { arrayEach } from '../internal/iterate'
import { createTreeFunc, type TreeInput, type TreeIterate, type TreeOptions } from '../internal/tree'

/**
 * 树搜索实现（旧 searchTreeItem）：带祖先命中状态的前序深度优先。
 *
 * - 节点自身命中（isAllow）或存在子级时进入处理：
 *   非 original 模式下浅拷贝节点（旧 assign({}, item)，即 Object.assign），
 *   可选 data 键回填原节点；递归结果写入 mapChildren 键；
 * - 自身命中或子级递归结果非空才保留；
 * - 旧实现 if/else-if 的 else 分支恒不可达（!(isAllow || hasChild) 时
 *   isAllow 必为假），移植时略去，行为不变。
 */
function searchTreeItem(
  parentAllow: unknown,
  parent: unknown,
  obj: unknown,
  iterate: TreeIterate,
  context: unknown,
  path: string[],
  nodes: unknown[],
  parseChildren: string,
  opts: TreeOptions
): unknown[] {
  const rests: unknown[] = []
  const hasOriginal = opts.original
  const sourceData = opts.data
  const mapChildren = (opts.mapChildren as string) || parseChildren
  arrayEach(obj as unknown[], function searchTreeCallback(item, index) {
    const paths = path.concat(['' + index])
    const childNodes = nodes.concat([item])
    const itemRecord = item as Record<string, unknown>
    const isAllow = parentAllow || iterate.call(context, item, index, obj as unknown[], paths, parent, childNodes)
    const children = parseChildren ? itemRecord[parseChildren] : undefined
    const hasChild = parseChildren && children
    if (isAllow || hasChild) {
      let rest: Record<string, unknown>
      if (hasOriginal) {
        rest = itemRecord
      } else {
        rest = Object.assign({}, itemRecord)
        if (sourceData) {
          rest[sourceData as string] = item
        }
      }
      rest[mapChildren] = searchTreeItem(
        isAllow,
        item,
        children,
        iterate,
        context,
        paths,
        childNodes,
        parseChildren,
        opts
      )
      if (isAllow || (rest[mapChildren] as unknown[]).length) {
        rests.push(rest)
      }
    }
  })
  return rests
}

const searchTreeImpl = createTreeFunc(function searchTreeHandle(
  parent: unknown,
  obj: unknown,
  iterate: TreeIterate,
  context: unknown,
  path: string[],
  nodes: unknown[],
  parseChildren: string,
  opts: TreeOptions
): unknown[] {
  return searchTreeItem(0, parent, obj, iterate, context, path, nodes, parseChildren, opts)
})

/**
 * 从树结构中根据回调查找数据（移植自旧 src/array/searchTree.js）
 *
 * 保留命中节点及其祖先/后代路径，未命中分支被剪掉；
 * 默认节点为浅拷贝并补子级键（空数组），original 选项保留原节点引用。
 * 节点类型 T 从 obj 入参推断（浅拷贝节点补子级键后仍以 T 计）。
 *
 * @param obj 对象/数组
 * @param iterate(item, index, items, path, parent, nodes) 回调（truthy 判定）
 * @param options {children: 'children', mapChildren: 'children', data: 'data', original: false}
 * @param context 上下文
 * @returns 搜索结果树数组
 */
export function searchTree<T = unknown>(
  obj: TreeInput<T>,
  iterate: TreeIterate<T, boolean>,
  options?: TreeOptions | null,
  context?: unknown
): T[] {
  return searchTreeImpl(obj, iterate, options, context) as T[]
}
