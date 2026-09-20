import { each } from '../internal/iterate'

/**
 * 数组去重（移植自旧 src/array/uniq.js）
 *
 * 旧版为 each + includes(result, value) 的 O(n²) 线性扫描；
 * 新版优先用 Set（SameValueZero，与原生 Array.prototype.includes 一致）：
 * NaN 可去重、数字 1 与字符串 '1' 互不去重、保持首次出现顺序——
 * 输出语义与旧版完全一致。
 *
 * @param array 数组（旧版经 each 兼容对象）
 * @returns 去重后的新数组
 */
export function uniq<T>(array: ReadonlyArray<T> | object | null | undefined): T[] {
  const result: T[] = []
  const seen = new Set<unknown>()
  each(array, function uniqItem(value) {
    if (!seen.has(value)) {
      seen.add(value)
      result.push(value as T)
    }
  })
  return result
}
