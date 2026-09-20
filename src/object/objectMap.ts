/**
 * 指定方法后的返回值组成的新对象（移植自旧 src/object/objectMap.js）
 *
 * 忠实旧语义（fixtures/object/objectMap.json 锁定）：
 * - iterate 为函数时按 (value, key, obj) 调用，context 作为 this；
 * - iterate 为非函数真值时视为属性名（旧版经 property(iterate) 生成取值器，
 *   此处内联取值语义：item 为 null 时取 undefined，否则取 item[property]，
 *   属性不存在时键保留、值为 undefined）；
 * - iterate 缺省（falsy）时原样返回入参对象；
 * - falsy 入参返回 {}；数组入参按索引成键（"0"、"1"）。
 */
import { each } from '../internal/iterate'
import { isFunction, isNull } from '../internal/type'

/** objectMap 迭代回调形态（数组入参时 key 为索引数字） */
export type ObjectMapIterator = (
  this: unknown,
  item: unknown,
  key: string | number,
  obj: unknown
) => unknown

/**
 * 指定方法后的返回值组成的新对象
 *
 * @param obj 对象/数组
 * @param iterate 回调 (item, key, obj)，或属性名（字符串/数字）
 * @param context 上下文
 * @returns 新对象（或 iterate 缺省时的原对象）
 */
export function objectMap(
  obj: unknown,
  iterate: ObjectMapIterator | string | number | null | undefined,
  context?: unknown
): unknown {
  const result: Record<string, unknown> = {}
  if (obj) {
    if (iterate) {
      const callback: ObjectMapIterator = isFunction(iterate)
        ? iterate
        : (item) => (isNull(item) ? undefined : (item as Record<PropertyKey, unknown>)[iterate as PropertyKey])
      each(obj, (val: unknown, index: string | number) => {
        result[index as string] = callback.call(context, val, index, obj)
      })
    } else {
      return obj
    }
  }
  return result
}
