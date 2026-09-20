import { isArray } from '../internal/type'

/**
 * 将一个数组分割成大小的组。如果数组不能被平均分配，那么最后一块将是剩下的元素
 * （移植自旧 src/array/chunk.js）
 *
 * - size 经 `>> 0 || 1` 归一：0/undefined/NaN 按 1 处理（fixture 锁定）；
 * - 组长不小于数组长度（或负数 size）时整体一组（空数组时返回原数组引用）；
 * - 非数组返回 []。
 *
 * @param array 数组
 * @param size 每组大小
 * @returns 分组结果
 */
export function chunk<T>(array: readonly T[] | null | undefined, size?: number): T[][] {
  const result: T[][] = []
  const sizeVal = size === undefined ? 0 : size
  const arrLen = sizeVal >> 0 || 1
  if (isArray(array)) {
    const list = array as T[]
    if (arrLen >= 0 && list.length > arrLen) {
      let index = 0
      while (index < list.length) {
        result.push(list.slice(index, index + arrLen))
        index += arrLen
      }
    } else {
      // 旧实现：空数组返回原数组引用（空数组同时也是合法的 T[][]），非空返回 [array]
      return list.length ? [list] : (list as unknown as T[][])
    }
  }
  return result
}
