import { createTreeFunc, type TreeInput, type TreeIterate, type TreeOptions } from '../internal/tree'
import { map } from './map'

/**
 * 树映射实现（旧 mapTreeItem）：逐层 map，回调结果写入子级键
 * （mapChildren 缺省回落 children 键）；仅在回调结果与原节点均非空且
 * 原节点存在子级时递归。
 */
function mapTreeItem(
  parent: unknown,
  obj: unknown,
  iterate: TreeIterate,
  context: unknown,
  path: string[],
  nodes: unknown[],
  parseChildren: string,
  opts: TreeOptions
): unknown[] {
  const mapChildren = (opts.mapChildren as string) || parseChildren
  // 断言说明：map 的运行时分派对非数组对象走 each，此处仅以数组形态过类型检查
  return map(obj as readonly unknown[], function mapTreeItemCallback(item: unknown, index: number): unknown {
    const paths = path.concat(['' + index])
    const childNodes = nodes.concat([item])
    const rest = iterate.call(context, item, index, obj as unknown[], paths, parent, childNodes) as Record<
      string,
      unknown
    >
    const children = item ? (item as Record<string, unknown>)[parseChildren] : undefined
    if (rest && item && parseChildren && children) {
      rest[mapChildren] = mapTreeItem(item, children, iterate, context, paths, childNodes, parseChildren, opts)
    }
    return rest
  })
}

const mapTreeImpl = createTreeFunc(mapTreeItem)

/**
 * 从树结构中指定方法后的返回值组成的新数组（移植自旧 src/array/mapTree.js）
 *
 * 节点类型 T 从 obj 入参推断，映射结果类型 R 从回调返回值推断。
 *
 * @param obj 对象/数组
 * @param iterate(item, index, items, path, parent, nodes) 回调（返回映射后的节点）
 * @param options {children: 'children', mapChildren: 'children'}
 * @param context 上下文
 * @returns 映射后的新树数组
 */
export function mapTree<T = unknown, R = unknown>(
  obj: TreeInput<T>,
  iterate: TreeIterate<T, R>,
  options?: TreeOptions | null,
  context?: unknown
): R[] {
  return mapTreeImpl(obj, iterate, options, context) as R[]
}
