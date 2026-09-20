/**
 * 检查键、路径是否是该对象的属性（移植自旧 src/object/has.js）
 *
 * 忠实旧语义：
 * - 自有键直接 hasOwnProp 命中返回 true；
 * - 否则按 getHGSKeys 拆分点路径逐级判定，每段支持 "a[0]" 形式的数组下标
 *   （正则要求 [数字] 位于段末尾）；
 * - 中途任一级不存在即中断返回 false；值为 undefined 的自有键仍算存在。
 */
import { getHGSKeys, staticHGKeyRE } from '../internal/paths'
import { hasOwnProp } from '../internal/type'

/**
 * 检查键、路径是否是该对象的属性
 *
 * @param obj 对象/数组
 * @param property 键、路径（点分字符串或字符串数组）
 * @returns 是否存在
 */
export function has(obj: unknown, property: string | readonly string[] | null | undefined): boolean {
  if (obj) {
    if (hasOwnProp(obj as object, property as string)) {
      return true
    }
    const props = getHGSKeys(property)
    const len = props.length
    let rest: unknown = obj
    for (let index = 0; index < len; index++) {
      let isHas = false
      const prop = props[index] as string
      const matchs = prop ? prop.match(staticHGKeyRE) : ''
      if (matchs) {
        const arrIndex = matchs[1]
        const objProp = matchs[2] as string
        const target = rest as Record<string, unknown>
        if (arrIndex) {
          if (target[arrIndex]) {
            if (hasOwnProp(target[arrIndex] as object, objProp)) {
              isHas = true
              rest = (target[arrIndex] as Record<string, unknown>)[objProp]
            }
          }
        } else {
          if (hasOwnProp(rest as object, objProp)) {
            isHas = true
            rest = (rest as Record<string, unknown>)[objProp]
          }
        }
      } else {
        if (hasOwnProp(rest as object, prop)) {
          isHas = true
          rest = (rest as Record<string, unknown>)[prop]
        }
      }
      if (isHas) {
        if (index === len - 1) {
          return true
        }
      } else {
        break
      }
    }
  }
  return false
}
