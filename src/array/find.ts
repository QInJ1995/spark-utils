import { hasOwnProp, isArray } from '../internal/type'

/**
 * 从左至右遍历，匹配最近的一条数据（移植自旧 src/array/find.js）
 *
 * 旧 helperCreateIterateHandle('find', 1, 3, true) 的显式展开（性能优化：不建闭包工厂）：
 * - 数组优先走原生 Array.prototype.find（context 作为 thisArg）；
 *   非函数 iterate 交由原生方法抛 TypeError（fixture 锁定）；
 * - 无 find 的数组（老环境兜底）走索引循环，命中返回元素；
 * - 对象走 for-in，命中返回属性值；
 * - obj/iterate 为空或未命中返回 undefined。
 *
 * @param obj 对象/数组
 * @param iterate(item, index, obj) 回调
 * @param context 上下文
 * @returns 匹配的值，未命中返回 undefined
 */
export function find<T>(
  obj: readonly T[] | null | undefined,
  iterate: (this: unknown, item: T, index: number, array: T[]) => unknown,
  context?: unknown
): T | undefined
export function find<T extends object>(
  obj: T | null | undefined,
  iterate: (this: unknown, item: T[keyof T], key: string, obj: T) => unknown,
  context?: unknown
): T[keyof T] | undefined
export function find(obj: unknown, iterate: unknown, context?: unknown): unknown {
  const callback = iterate as (this: unknown, item: unknown, key: string | number, obj: unknown) => unknown
  if (obj && callback) {
    const nativeFind = (obj as { find?: unknown }).find
    if (nativeFind) {
      return (obj as { find: (iterate: unknown, context?: unknown) => unknown }).find(callback, context)
    }
    if (isArray(obj)) {
      const list = obj as unknown[]
      for (let index = 0, len = list.length; index < len; index++) {
        if (callback.call(context, list[index], index, list)) {
          return list[index]
        }
      }
      return undefined
    }
    const target = obj as Record<string, unknown>
    for (const key in target) {
      if (hasOwnProp(target, key)) {
        if (callback.call(context, target[key], key, target)) {
          return target[key]
        }
      }
    }
  }
  return undefined
}
