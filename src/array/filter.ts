import { each } from '../internal/iterate'

/**
 * 根据回调过滤数据（移植自旧 src/array/filter.js）
 *
 * - 数组优先走原生 Array.prototype.filter（context 作为 thisArg）；
 * - 其余（对象/字符串等）走 each 分派迭代，回调真值收集对应值；
 * - obj/iterate 为空返回 []（fixture：iterate 为 null 返回 []）。
 *
 * @param obj 对象/数组
 * @param iterate(item, index, obj) 回调
 * @param context 上下文
 * @returns 过滤结果组成的数组（对象入参返回值数组）
 */
export function filter<T>(
  obj: readonly T[] | null | undefined,
  iterate: (this: unknown, item: T, index: number, array: T[]) => unknown,
  context?: unknown
): T[]
export function filter<T extends object>(
  obj: T | null | undefined,
  iterate: (this: unknown, item: T[keyof T], key: string, obj: T) => unknown,
  context?: unknown
): Array<T[keyof T]>
export function filter(obj: unknown, iterate: unknown, context?: unknown): unknown[] {
  const result: unknown[] = []
  const callback = iterate as (this: unknown, item: unknown, key: string | number, obj: unknown) => unknown
  if (obj && callback) {
    const nativeFilter = (obj as { filter?: unknown }).filter
    if (nativeFilter) {
      return (obj as { filter: (iterate: unknown, context?: unknown) => unknown[] }).filter(callback, context)
    }
    each(obj, function filterItem(val, key) {
      if (callback.call(context, val, key, obj)) {
        result.push(val)
      }
    })
  }
  return result
}
