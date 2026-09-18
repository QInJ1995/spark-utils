import { each } from '../internal/iterate'

/**
 * 指定方法后的返回值组成的新数组（移植自旧 src/array/map.js）
 *
 * - 仅在实参个数 > 1 时执行（fixture：缺 iterate 返回 []）；
 * - 数组优先走原生 Array.prototype.map（context 作为 thisArg）；
 * - 其余（对象/字符串等，运行时兼容字符串逐字符映射）走 each 分派迭代；
 * - obj 为空返回 []。
 *
 * @param obj 对象/数组（运行时兼容字符串）
 * @param iterate(item, index, obj) 回调
 * @param context 上下文
 * @returns 映射结果组成的新数组
 */
export function map<T, R>(
  obj: readonly T[] | null | undefined,
  iterate: (this: unknown, item: T, index: number, array: T[]) => R,
  context?: unknown
): R[]
export function map<T extends object, R>(
  obj: T | null | undefined,
  iterate: (this: unknown, item: T[keyof T], key: string, obj: T) => R,
  context?: unknown
): R[]
export function map(obj: unknown, iterate: unknown, context?: unknown): unknown[] {
  const result: unknown[] = []
  const callback = iterate as (this: unknown, item: unknown, key: string | number, obj: unknown) => unknown
  if (obj && arguments.length > 1) {
    const nativeMap = (obj as { map?: unknown }).map
    if (nativeMap) {
      return (obj as { map: (iterate: unknown, context?: unknown) => unknown[] }).map(callback, context)
    }
    each(obj, function mapItem(val, key) {
      result.push(callback.call(context, val, key, obj))
    })
  }
  return result
}
