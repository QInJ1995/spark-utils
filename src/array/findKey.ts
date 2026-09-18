import { hasOwnProp } from '../internal/type'

/**
 * 查找匹配第一条数据的键（移植自旧 src/array/findKey.js）
 *
 * 旧 helperCreateIterateHandle('', 0, 2, true) 的显式展开（性能优化：不建闭包工厂）：
 * - prop 为空串 → 永不走原生方法；
 * - useArray 为 0 → 数组入参也走 for-in（怪癖忠实保留：
 *   对数组返回字符串索引 "1"，fixture 锁定）；
 * - 命中返回键名，obj/iterate 为空或未命中返回 undefined。
 *
 * @param obj 对象/数组
 * @param iterate(item, key, obj) 回调
 * @param context 上下文
 * @returns 命中的键名（数组为字符串索引），未命中返回 undefined
 */
export function findKey(
  obj: ReadonlyArray<unknown> | null | undefined,
  iterate: (this: unknown, item: unknown, key: string, obj: unknown) => unknown,
  context?: unknown
): string | undefined
export function findKey(
  obj: Record<string, unknown> | null | undefined,
  iterate: (this: unknown, item: unknown, key: string, obj: unknown) => unknown,
  context?: unknown
): string | undefined
export function findKey(obj: unknown, iterate: unknown, context?: unknown): string | undefined {
  const callback = iterate as (this: unknown, item: unknown, key: string | number, obj: unknown) => unknown
  if (obj && callback) {
    const target = obj as Record<string, unknown>
    for (const key in target) {
      if (hasOwnProp(target, key)) {
        if (callback.call(context, target[key], key, target)) {
          return key
        }
      }
    }
  }
  return undefined
}
