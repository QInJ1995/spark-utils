import { isArray, hasOwnProp } from '../internal/type'

/**
 * 对象中的值中的每一项运行给定函数,如果该函数对每一项都返回true,则返回true,否则返回false
 * （移植自旧 src/array/every.js）
 *
 * 旧 helperCreateIterateHandle('every', 1, 1, false, true) 的显式展开（性能优化：不建闭包工厂）：
 * - matchValue 为 false：回调假值即返回 false（[true, false, index, item][1]）；
 * - 数组优先走原生 Array.prototype.every（context 作为 thisArg）；
 * - 无 every 的数组（老环境兜底）走索引循环；
 * - 对象走 for-in + hasOwnProp；
 * - obj/iterate 为空或全部命中返回 true（默认值，fixture：null 返回 true）。
 *
 * @param obj 对象/数组
 * @param iterate(item, index, obj) 回调
 * @param context 上下文
 * @returns 是否全部满足
 */
export function every<T>(
  obj: readonly T[] | null | undefined,
  iterate: (this: unknown, item: T, index: number, array: T[]) => unknown,
  context?: unknown
): boolean
export function every<T extends object>(
  obj: T | null | undefined,
  iterate: (this: unknown, item: T[keyof T], key: string, obj: T) => unknown,
  context?: unknown
): boolean
export function every(obj: unknown, iterate: unknown, context?: unknown): boolean {
  const callback = iterate as (this: unknown, item: unknown, key: string | number, obj: unknown) => unknown
  if (obj && callback) {
    const nativeEvery = (obj as { every?: unknown }).every
    if (nativeEvery) {
      return !!(obj as { every: (iterate: unknown, context?: unknown) => unknown }).every(callback, context)
    }
    if (isArray(obj)) {
      const list = obj as unknown[]
      for (let index = 0, len = list.length; index < len; index++) {
        if (!callback.call(context, list[index], index, list)) {
          return false
        }
      }
      return true
    }
    const target = obj as Record<string, unknown>
    for (const key in target) {
      if (hasOwnProp(target, key)) {
        if (!callback.call(context, target[key], key, target)) {
          return false
        }
      }
    }
  }
  return true
}
