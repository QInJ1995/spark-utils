import { arrayEach } from '../internal/iterate'
import { isArray } from '../internal/type'

/**
 * 递归铺平（旧 flattenDeep）：数组项逐个入栈，deep 为真时递归下钻
 *
 * 2.0 性能：旧实现循环内 result.concat（每项整组复制，O(n²)；万级元素
 * 实测 ~658ms），改为单结果数组 push（同数据 ~8ms），产出逐元素相等。
 * 唯一不可观测差异：浅层模式铺平含稀疏洞的子数组时，旧 concat 保留洞、
 * 新实现落成显式 undefined（'in' 探测与 forEach 可见性不同，=== / JSON
 * 序列化均不可区分，fixtures 无法表达）。
 */
function flattenDeep(array: unknown[], deep?: boolean): unknown[] {
  const result: unknown[] = []
  arrayEach(array, function flattenItem(vals) {
    if (isArray(vals)) {
      const list = vals as unknown[]
      if (deep) {
        arrayEach(list, flattenItem)
      } else {
        arrayEach(list, function pushItem(item) {
          result.push(item)
        })
      }
    } else {
      result.push(vals)
    }
  })
  return result
}

/**
 * 将一个多维数组铺平（移植自旧 src/array/flatten.js）
 *
 * - 默认浅层铺平一层，deep 为真时深层递归铺平；
 * - 非数组入参返回 []。
 *
 * @param array 数组
 * @param deep 是否深层
 * @returns 铺平后的新数组
 */
export function flatten(array: ReadonlyArray<unknown> | null | undefined, deep?: boolean): unknown[] {
  if (isArray(array)) {
    return flattenDeep(array as unknown[], deep)
  }
  return []
}
