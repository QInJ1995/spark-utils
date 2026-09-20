import { isNull } from '../internal/type'
import { map } from './map'

/**
 * 获取数组对象中某属性值，返回一个数组（移植自旧 src/array/pluck.js）
 *
 * 旧版为 map(obj, property(key))；property 的 isNull 守卫在此内联：
 * null 项映射为 undefined，其余直接取键（键不存在亦为 undefined）。
 *
 * @param obj 数组/对象
 * @param key 属性名
 * @returns 属性值组成的数组
 */
export function pluck(
  obj: ReadonlyArray<unknown> | Record<string, unknown> | null | undefined,
  key: string | number
): unknown[] {
  const name = key as string
  return map(obj, function pluckItem(item) {
    return isNull(item) ? undefined : (item as Record<string, unknown>)[name]
  })
}
