/**
 * 根据 key 排除指定的属性值，返回一个新的对象（移植自旧 src/object/omit.js）
 *
 * 旧版经 helperCreatePickOmit(0, 1) 工厂生成，此处内联为命中即排除：
 * - 第二参为函数时按 (value, key, obj) 调用做筛选（this 取调用时的上下文）；
 * - 否则把从第二参起的所有参数（数组展平）作为键名列表，命中即排除；
 * - falsy 入参返回 {}（未命中的键原样保留）。
 */
import { each } from '../internal/iterate'
import { isArray, isFunction } from '../internal/type'

/** pick/omit 的函数式筛选回调 */
export type PickOmitCallback = (this: unknown, value: unknown, key: string | number, obj: unknown) => boolean

/**
 * 根据 key 排除指定的属性值，返回一个新的对象
 *
 * @param obj 对象/数组
 * @param selector 函数筛选器，或若干键名（字符串/字符串数组）
 * @returns 排除后的新对象
 */
export function omit(this: unknown, obj: unknown, ...selector: unknown[]): Record<string, unknown> {
  const rest: Record<string, unknown> = {}
  const keyList: unknown[] = []
  const first = selector[0]
  const callback = isFunction(first) ? (first as PickOmitCallback) : undefined
  if (!callback) {
    for (const item of selector) {
      if (isArray(item)) {
        keyList.push(...item)
      } else {
        keyList.push(item)
      }
    }
  }
  each(obj, (val: unknown, key: string | number) => {
    const matched = callback ? callback.call(this, val, key, obj) : keyList.some((name) => name === key)
    if (!matched) {
      rest[key as string] = val
    }
  })
  return rest
}
