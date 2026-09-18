/**
 * 设置对象属性上的值（移植自旧 src/object/set.js）
 *
 * 忠实旧语义（fixtures/object/set.json 锁定）：
 * - 自有键（含值为 falsy 的自有键）直接覆盖；
 * - 路径不存在则自动创建中间对象，"list[0]" 形式自动创建稀疏数组；
 * - __proto__ / constructor / prototype 键进入黑名单被忽略（防原型污染，
 *   直接键与路径段两级均拦截）；
 * - 返回原对象。
 */
import { getHGSKeys } from '../internal/paths'
import { hasOwnProp } from '../internal/type'

/** 与旧版 sKeyRE 一致：要求 [数字] 位于键末尾 */
const sKeyRE = /(.+)\[(\d+)\]$/

/**
 * 黑名单某些键，防止原型污染
 *
 * @param key 属性键
 */
function isPrototypePolluted(key: string): boolean {
  return key === '__proto__' || key === 'constructor' || key === 'prototype'
}

/**
 * 设置一段路径上的值，路径不存在时按需创建对象/稀疏数组
 *
 * @param obj 当前层级对象
 * @param key 路径段
 * @param isSet 是否为最后一段（真正写入值的段）
 * @param value 待写入的值
 * @returns 该层级的值（用于继续向深层游走）
 */
function setDeepProps(obj: Record<string, unknown>, key: string, isSet: boolean, value: unknown): unknown {
  if (obj[key]) {
    if (isSet) {
      obj[key] = value
    }
  } else {
    const matchs = key ? key.match(sKeyRE) : null
    const rest = isSet ? value : {}
    if (matchs) {
      const index = parseInt(matchs[2] as string, 10)
      const baseKey = matchs[1] as string
      if (obj[baseKey]) {
        ;(obj[baseKey] as Record<PropertyKey, unknown>)[index] = rest
      } else {
        obj[baseKey] = new Array(index + 1)
        ;(obj[baseKey] as Record<PropertyKey, unknown>)[index] = rest
      }
    } else {
      obj[key] = rest
    }
    return rest
  }
  return obj[key]
}

/**
 * 设置对象属性上的值。如果属性不存在则创建它
 *
 * @param obj 对象/数组
 * @param property 键、路径（点分字符串或字符串数组）
 * @param value 值
 * @returns 原对象
 */
export function set(
  obj: object | null | undefined,
  property: string | readonly string[] | null | undefined,
  value: unknown
): object | null | undefined {
  if (obj) {
    const target = obj as Record<PropertyKey, unknown>
    if (
      (target[property as PropertyKey] || hasOwnProp(obj, property as string)) &&
      !isPrototypePolluted(property as string)
    ) {
      target[property as PropertyKey] = value
    } else {
      let rest: unknown = obj
      const props = getHGSKeys(property)
      const len = props.length
      for (let index = 0; index < len; index++) {
        const prop = props[index] as string
        if (isPrototypePolluted(prop)) continue
        rest = setDeepProps(rest as Record<string, unknown>, prop, index === len - 1, value)
      }
    }
  }
  return obj
}
