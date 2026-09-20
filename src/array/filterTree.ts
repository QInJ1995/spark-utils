import { type TreeInput, type TreeIterate, type TreeOptions } from '../internal/tree'
import { eachTree } from './eachTree'

/**
 * 从树结构中根据回调过滤数据（移植自旧 src/array/filterTree.js）
 *
 * 深度优先遍历全部节点，命中项平铺收集（不保留树结构）；
 * obj/iterate 为空返回 []。节点类型 T 从 obj 入参推断。
 *
 * @param obj 对象/数组
 * @param iterate(item, index, items, path, parent, nodes) 回调（truthy 判定）
 * @param options {children: 'children'}
 * @param context 上下文
 * @returns 命中节点组成的扁平数组
 */
export function filterTree<T = unknown>(
  obj: TreeInput<T>,
  iterate: TreeIterate<T, boolean>,
  options?: TreeOptions | null,
  context?: unknown
): T[] {
  const result: T[] = []
  if (obj && iterate) {
    eachTree(
      obj,
      function filterTreeItem(
        item: T,
        index: number,
        items: T[],
        path: string[],
        parent: T | null,
        nodes: T[]
      ) {
        if (iterate.call(context, item, index, items, path, parent, nodes)) {
          result.push(item)
        }
      },
      options
    )
  }
  return result
}
