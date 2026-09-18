/**
 * 最值函数工厂（内部模块，移植自旧 src/helpers/helperCreateMinMax.js）
 *
 * min / max 两个公共方法共用本工厂，行为（含怪癖）与旧版一致：
 * - iterate 为函数时取回调值比较，为字符串时按属性路径取值比较；
 * - null / undefined 项被 eqNull 跳过；空数组返回 undefined；
 * - 返回的是原数组元素（arr[itemIndex]），非比较值。
 *
 * 不进 index.ts 具名导出。
 */
import { arrayEach } from '../internal/iterate'
import { getHGSKeys, staticHGKeyRE } from '../internal/paths'
import { eqNull, hasOwnProp, isFunction, isUndefined } from '../internal/type'

/** 最值比较回调（rest > itemVal 取最小，rest < itemVal 取最大） */
type MinMaxHandle = (rest: unknown, itemVal: unknown) => boolean

/** 最值迭代参数：回调或属性路径（含 "a.b[2]" 形式） */
export type MinMaxIterate<T> = string | ((item: T, index: number, obj: T[]) => unknown)

/** 创建最值函数（min / max） */
export function helperCreateMinMax(handle: MinMaxHandle): <T>(arr: T[], iterate?: MinMaxIterate<T>) => T | undefined {
  return function <T>(arr: T[], iterate?: MinMaxIterate<T>): T | undefined {
    let rest: unknown
    let itemIndex: number | undefined
    if (arr && arr.length) {
      arrayEach(arr, (rawVal, index) => {
        let itemVal: unknown = rawVal
        if (iterate) {
          itemVal = isFunction(iterate) ? iterate(rawVal, index, arr) : get(rawVal, iterate)
        }
        if (!eqNull(itemVal) && (eqNull(rest) || handle(rest, itemVal))) {
          itemIndex = index
          rest = itemVal
        }
      })
      // 旧实现返回 arr[itemIndex]（itemIndex 未更新时为 arr[undefined]，同为 undefined）
      return itemIndex === undefined ? undefined : arr[itemIndex]
    }
    // 空数组 / 空值入参：rest 未被赋值，返回 undefined
    return rest as undefined
  }
}

/* ---------------------------------------------------------------------------
 * 以下为旧 src/object/get.js 的私有移植（仅本文件使用，不导出）：
 * number 域禁止横向引用 object 域，字符串 iterate 的属性路径取值在此内联实现。
 * ------------------------------------------------------------------------- */

/** 按路径取值（含 "a.b[2]" 数组下标路径；eqNull 入参返回默认值） */
function get(obj: unknown, property: string, defaultValue?: unknown): unknown {
  if (eqNull(obj)) {
    return defaultValue
  }
  const result = getValueByPath(obj, property)
  return isUndefined(result) ? defaultValue : result
}

/** 解析单个路径段（末尾形如 key[2] 时深入索引） */
function getDeepProps(obj: unknown, key: string): unknown {
  const matchs = key ? key.match(staticHGKeyRE) : null
  if (matchs) {
    const record = obj as Record<string, unknown>
    const head = matchs[1]
    const tail = matchs[2]
    if (head) {
      const headVal = record[head]
      return headVal ? (headVal as Record<string, unknown>)[tail ?? ''] : undefined
    }
    return record[tail ?? '']
  }
  return (obj as Record<string, unknown>)[key]
}

/** 逐段沿路径取值（falsy 中断返回 undefined，末段保留 null 结果；空路径返回原对象） */
function getValueByPath(obj: object, property: string): unknown {
  if (obj) {
    const record = obj as Record<string, unknown>
    if (record[property] || hasOwnProp(obj, property)) {
      return record[property]
    }
    const props = getHGSKeys(property)
    const len = props.length
    let rest: unknown = obj
    if (len) {
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
