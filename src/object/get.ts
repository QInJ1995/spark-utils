/**
 * 获取对象的属性的值（移植自旧 src/object/get.js）
 *
 * 忠实旧语义（fixtures/object/get.json 锁定）：
 * - eqNull 入参直接返回默认值；
 * - 值为 undefined 时返回默认值（null / 0 等 falsy 返回原值）；
 * - 路径逐段取值由 internal/paths 的 getValueByPath 共享实现（2.0 去重：
 *   本文件即 canonical，getDeepProps/getValueByPath 已下沉至 internal/paths）。
 */
import { getValueByPath } from '../internal/paths'
import { eqNull, isUndefined } from '../internal/type'

/**
 * 获取对象的属性的值，如果值为 undefined，则返回默认值
 *
 * @param obj 对象/数组
 * @param property 键、路径（点分字符串或字符串数组）
 * @param defaultValue 默认值
 * @returns 取到的值或默认值
 */
export function get(
  obj: unknown,
  property: string | readonly string[] | null | undefined,
  defaultValue?: unknown
): unknown {
  if (eqNull(obj)) {
    return defaultValue
  }
  const result = getValueByPath(obj, property)
  return isUndefined(result) ? defaultValue : result
}
