/**
 * 最值函数工厂（内部模块，移植自旧 src/helpers/helperCreateMinMax.js）
 *
 * min / max 两个公共方法共用本工厂，行为（含怪癖）与旧版一致：
 * - iterate 为函数时取回调值比较，为字符串时按属性路径取值比较；
 * - null / undefined 项被 eqNull 跳过；空数组返回 undefined；
 * - 返回的是原数组元素（arr[itemIndex]），非比较值。
 *
 * 不进 index.ts 具名导出。
 *
 * 横引消除（2.0 去重）：字符串 iterate 的属性路径取值曾在本文件私有内联
 * 旧 src/object/get.js，现直取 internal/paths 的共享 getValueByPath
 * （等价于旧 get 不传默认值的形态）。
 */
import { arrayEach } from '../internal/iterate'
import { getValueByPath } from '../internal/paths'
import { eqNull, isFunction } from '../internal/type'

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
          itemVal = isFunction(iterate) ? iterate(rawVal, index, arr) : getValueByPath(rawVal, iterate)
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
