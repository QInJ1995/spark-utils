/**
 * 获取对象的属性的值（移植自旧 src/object/get.js）
 *
 * 忠实旧语义（fixtures/object/get.json 锁定）：
 * - eqNull 入参直接返回默认值；
 * - 自有键直接命中（值为 null / 0 等 falsy 也返回原值，仅 undefined 走默认值）；
 * - 点路径逐级取值，段内支持 "list[1]" 数组下标（正则要求 [数字] 在段末尾）；
 * - 中途 eqNull：最后一段返回该 null/undefined，非最后一段直接返回 undefined。
 */
import { getHGSKeys, staticHGKeyRE } from '../internal/paths'
import { eqNull, hasOwnProp, isUndefined } from '../internal/type'

/**
 * 取一段路径上的值，支持 "a[0]" 形式的数组下标
 *
 * @param obj 当前层级对象
 * @param key 路径段
 */
function getDeepProps(obj: unknown, key: string): unknown {
  const matchs = key ? key.match(staticHGKeyRE) : ''
  if (matchs) {
    const arrKey = matchs[1]
    const idxKey = matchs[2] as string
    const target = obj as Record<string, unknown>
    if (arrKey) {
      return target[arrKey] ? (target[arrKey] as Record<string, unknown>)[idxKey] : undefined
    }
    return target[idxKey]
  }
  return (obj as Record<string, unknown>)[key]
}

/**
 * 按路径取值（不处理默认值）
 *
 * @param obj 对象
 * @param property 键、路径
 */
function getValueByPath(obj: unknown, property: string | readonly string[] | null | undefined): unknown {
  if (obj) {
    const target = obj as Record<PropertyKey, unknown>
    if (target[property as PropertyKey] || hasOwnProp(obj as object, property as string)) {
      return target[property as PropertyKey]
    }
    const props = getHGSKeys(property)
    const len = props.length
    let rest: unknown
    if (len) {
      rest = obj
      for (let index = 0; index < len; index++) {
        rest = getDeepProps(rest, props[index] as string)
        if (eqNull(rest)) {
          if (index === len - 1) {
            return rest
          }
          return undefined
        }
      }
    }
    return rest
  }
  return undefined
}

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
