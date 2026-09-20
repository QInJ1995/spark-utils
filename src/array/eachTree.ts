import { each } from '../internal/iterate'
import { createTreeFunc, type TreeIterate, type TreeOptions } from '../internal/tree'

/**
 * 树遍历实现（旧 eachTreeItem）：前序深度优先；
 * 进入子级前把子级键名追加进 path（paths.push(parseChildren) 的原地变异）。
 */
function eachTreeItem(
  parent: unknown,
  obj: unknown,
  iterate: TreeIterate,
  context: unknown,
  path: string[],
  nodes: unknown[],
  parseChildren: string,
  opts: TreeOptions
): void {
  each(obj, function eachTreeItemCallback(item, index) {
    const paths = path.concat(['' + index])
    const childNodes = nodes.concat([item])
    // each 分派下数组键为数字索引；obj 以数组形态过回调的 items 参数类型检查
    iterate.call(context, item, index as number, obj as unknown[], paths, parent, childNodes)
    if (item && parseChildren) {
      paths.push(parseChildren)
      eachTreeItem(
        item,
        (item as Record<string, unknown>)[parseChildren],
        iterate,
        context,
        paths,
        childNodes,
        parseChildren,
        opts
      )
    }
  })
}

/**
 * 从树结构中遍历数据的键、值、路径（移植自旧 src/array/eachTree.js）
 *
 * 遍历经 each 分派（数组/对象皆可）；null 入参不抛错，返回 undefined。
 * 回调返回值不消费（void）；节点类型 T 从 obj 入参推断。
 *
 * @param obj 对象/数组
 * @param iterate(item, index, items, path, parent, nodes) 回调（根层 parent 为 null）
 * @param options {children: 'children', mapChildren: 'children'}
 * @param context 上下文
 */
export const eachTree = createTreeFunc(eachTreeItem)
