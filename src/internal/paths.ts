/**
 * 路径取值共享实现（L0）
 *
 * 内容：staticHGKeyRE / getHGSKeys / getDeepProps / getValueByPath。
 * 2.0 去重：M3 时期因公共域禁止横向互引，object/get、array/sum、array/orderBy、
 * string/template、number/helperCreateMinMax 五处各自私有内联了同一份路径取值
 * （来源均为旧 src/object/get.js）；现下沉到本文件单一实现，各调用点改引
 * internal/paths（core → internal L0 合法，且无环）。
 *
 * canonical 语义以 object/get.ts 的移植版为准（fixtures/object/get.json 锁定）；
 * 曾存在的实现差异仅一处：template/minMax 的内联版在「空路径」（property 化简后
 * 键数组为空）时返回原对象，canonical 返回 undefined——该分支仅当模板键为纯空白
 * （如 "{{ }}"）时可达，且旧版 1.x 走的正是 canonical 行为，收敛即恢复旧语义。
 */
import { eqNull, hasOwnProp } from './type'

/**
 * 路径键正则（移植自 src/constant/static/staticHGKeyRE.js，
 * src/constant/RegEx/staticHGKeyRE.js 内容相同，合并为一份导出）。
 * 用于 get/has/set 中探测 "a.b[2]" 形式的数组下标路径。
 */
export const staticHGKeyRE = /(.+)?\[(\d+)\]$/

/**
 * 解析属性路径为键数组（移植自 src/helpers/helperGetHGSKeys.js）
 *
 * 忠实旧语义：
 * - falsy 返回 []；
 * - 同时具备 splice 与 join（最快数组探测，可忽略准确性）直接返回原数组引用（不拷贝）；
 * - 其余按 '' + property 字符串化后以 '.' 拆分。
 *
 * @param property 属性路径（点分字符串或字符串数组；sum/orderBy 的数字属性经
 *                 '' + property 归入字符串拆分语义，行为一致）
 * @returns 键数组
 */
export function getHGSKeys(property: string | number | readonly string[] | null | undefined): string[] {
  if (property) {
    const prop = property as unknown as { splice?: unknown; join?: unknown }
    if (prop.splice && prop.join) {
      return property as unknown as string[]
    }
    return ('' + property).split('.')
  }
  return []
}

/**
 * 取一段路径上的值，支持 "a[0]" 形式的数组下标（旧 src/object/get.js 的 getDeepProps）
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
 * 按路径取值（不处理默认值；旧 src/object/get.js 的 getValueByPath）
 *
 * 忠实语义：
 * - 自有键直接命中（值为 null / 0 等 falsy 也返回原值）；
 * - 点路径逐级取值，段内支持 "list[1]" 数组下标（正则要求 [数字] 在段末尾）；
 * - 中途 eqNull：最后一段返回该 null/undefined，非最后一段返回 undefined；
 * - 空路径 / falsy obj 返回 undefined。
 *
 * @param obj 对象
 * @param property 键、路径
 */
export function getValueByPath(
  obj: unknown,
  property: string | number | readonly string[] | null | undefined
): unknown {
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
