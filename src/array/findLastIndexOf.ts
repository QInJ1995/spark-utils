import { hasOwnProp, isArray, isFunction, isString } from '../internal/type'

/**
 * 数组/对象迭代查找回调形态（旧 helpers/helperCreateiterateIndexOf.js 的内联展开）
 *
 * 回调消费 (item, index, obj) 三参，命中即返回。
 */
type IndexOfIterate = (this: unknown, item: unknown, key: string | number, obj: unknown) => unknown

/**
 * 从最后开始的索引值,返回对象第一个索引值（移植自旧 src/array/findLastIndexOf.js）
 *
 * 旧 helperCreateiterateIndexOf 的展开内联实现（性能优化：不建闭包工厂）：
 * - 数组/字符串走倒序索引循环，命中返回索引（未命中 -1）；
 * - 其余对象仍走正序 for-in + hasOwnProp，命中返回键名
 *   （怪癖忠实保留：对象分支与 findIndexOf 结果相同，fixture 锁定）；
 * - obj 为空或 iterate 非函数返回 -1。
 *
 * @param obj 对象/数组（运行时兼容字符串）
 * @param iterate(item, index, obj) 回调
 * @param context 上下文
 * @returns 数组/字符串返回索引，对象返回键名，未命中返回 -1
 */
export function findLastIndexOf(
  obj: ReadonlyArray<unknown> | string | null | undefined,
  iterate: IndexOfIterate,
  context?: unknown
): number
export function findLastIndexOf(
  obj: Record<string, unknown> | null | undefined,
  iterate: IndexOfIterate,
  context?: unknown
): string | number
export function findLastIndexOf(obj: unknown, iterate: unknown, context?: unknown): unknown {
  const callback = iterate as IndexOfIterate
  if (obj && isFunction(callback)) {
    if (isArray(obj) || isString(obj)) {
      const list = obj as unknown as { length: number } & Record<number, unknown>
      for (let len = list.length - 1; len >= 0; len--) {
        if (callback.call(context, list[len], len, obj)) {
          return len
        }
      }
      return -1
    }
    const target = obj as Record<string, unknown>
    for (const key in target) {
      if (hasOwnProp(target, key)) {
        if (callback.call(context, target[key], key, obj)) {
          return key
        }
      }
    }
  }
  return -1
}
