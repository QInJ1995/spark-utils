import { arrayEach } from '../internal/iterate'
import { isArray } from '../internal/type'

/**
 * 递归铺平（旧 flattenDeep）：数组项展开拼接，deep 为真时递归下钻
 */
function flattenDeep(array: unknown[], deep?: boolean): unknown[] {
  let result: unknown[] = []
  arrayEach(array, function flattenItem(vals) {
    result = result.concat(isArray(vals) ? (deep ? flattenDeep(vals, deep) : (vals as unknown[])) : [vals])
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
