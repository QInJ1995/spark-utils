import { isArray, hasOwnProp } from '../internal/type'

/**
 * 对象中的值中的每一项运行给定函数,如果函数对任一项返回true,则返回true,否则返回false
 * （移植自旧 src/array/some.js）
 *
 * 旧 helperCreateIterateHandle('some', 1, 0, true, false) 的显式展开（性能优化：不建闭包工厂）：
 * - 数组优先走原生 Array.prototype.some（context 作为 thisArg）；
 * - 无 some 的数组（老环境兜底）走索引循环，任一回调真值即返回 true；
 * - 对象走 for-in + hasOwnProp，任一回调真值即返回 true；
 * - obj/iterate 为空或全部不命中返回 false（默认值）。
 *
 * @param obj 对象/数组
 * @param iterate(item, index, obj) 回调
 * @param context 上下文
 * @returns 是否存在命中项
 */
export function some<T>(
  obj: readonly T[] | null | undefined,
  iterate: (this: unknown, item: T, index: number, array: T[]) => unknown,
  context?: unknown
): boolean
export function some<T extends object>(
  obj: T | null | undefined,
  iterate: (this: unknown, item: T[keyof T], key: string, obj: T) => unknown,
  context?: unknown
): boolean
export function some(obj: unknown, iterate: unknown, context?: unknown): boolean {
  const callback = iterate as (this: unknown, item: unknown, key: string | number, obj: unknown) => unknown
  if (obj && callback) {
    const nativeSome = (obj as { some?: unknown }).some
    if (nativeSome) {
      return !!(obj as { some: (iterate: unknown, context?: unknown) => unknown }).some(callback, context)
    }
    if (isArray(obj)) {
      const list = obj as unknown[]
      for (let index = 0, len = list.length; index < len; index++) {
        if (callback.call(context, list[index], index, list)) {
          return true
        }
      }
      return false
    }
    const target = obj as Record<string, unknown>
    for (const key in target) {
      if (hasOwnProp(target, key)) {
        if (callback.call(context, target[key], key, target)) {
          return true
        }
      }
    }
  }
  return false
}
