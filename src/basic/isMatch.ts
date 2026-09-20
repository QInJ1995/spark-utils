/**
 * 判断属性中的键和值是否包含在对象中（移植自旧 src/basic/isMatch.js）
 *
 * 2.0 去重：M3 时期本函数与其全部私有依赖（keys/includes/includeArrays/
 * findIndexOf/isEqual/helperEqualCompare）曾在 internal/type/guards.ts 双轨
 * 移植；现收敛至此——深度比较直取 internal/compare 的 canonical
 * helperEqualCompare（与 ./isEqual 同一实现），其余小依赖留作本文件私有
 * （basic 域禁止横向引 array 域，findIndexOf/includeArrays 不便借用公共版）。
 */
import { defaultCompare, helperEqualCompare } from '../internal/compare'
import { isArray } from '../internal/type'

/** 旧 keys.js：Object.keys 可用时即 Object.keys，假值入参返回 [] */
function keys(obj: unknown): string[] {
  return obj ? Object.keys(obj as object) : []
}

/** 旧 includes.js：优先 obj.includes，否则 for-in + hasOwnProperty 逐值比对 */
function includes(obj: unknown, val: unknown): boolean {
  if (obj) {
    const target = obj as {
      includes?: (searchValue: unknown) => unknown
      hasOwnProperty?: (key: string) => boolean
    }
    if (target.includes) {
      return !!target.includes(val)
    }
    for (const key in obj as object) {
      if (target.hasOwnProperty && target.hasOwnProperty(key)) {
        if (val === (obj as Record<string, unknown>)[key]) {
          return true
        }
      }
    }
  }
  return false
}

/** 旧 includeArrays.js：两参均为数组时判断包含，否则退化为 includes */
function includeArrays(array1: unknown, array2: unknown): boolean {
  if (isArray(array1) && isArray(array2)) {
    for (const item of array2) {
      if (!includes(array1, item)) {
        return false
      }
    }
    return true
  }
  return includes(array1, array2)
}

/** 旧 findIndexOf.js 的数组路径（isMatch 中入参恒为 Object.keys 结果） */
function findIndexOf(arr: string[], iterate: (item: string) => boolean): number {
  for (let index = 0; index < arr.length; index++) {
    if (iterate(arr[index] as string)) {
      return index
    }
  }
  return -1
}

/** 旧 isEqual.js 的无自定义比较形态（canonical 实现位于 internal/compare） */
function isEqual(obj1: unknown, obj2: unknown): boolean {
  return helperEqualCompare(obj1, obj2, defaultCompare)
}

/**
 * 判断属性中的键和值是否包含在对象中
 *
 * @param obj 对象
 * @param source 被包含的键值对象
 * @returns source 为空对象时 true；键数组包含时按值深度比较，否则整体深度比较
 */
export function isMatch(obj: unknown, source: unknown): boolean {
  const objKeys = keys(obj)
  const sourceKeys = keys(source)
  if (sourceKeys.length) {
    if (includeArrays(objKeys, sourceKeys)) {
      return (
        sourceKeys.some((key2) =>
          findIndexOf(
            objKeys,
            (key1) =>
              key1 === key2 &&
              isEqual((obj as Record<string, unknown>)[key1], (source as Record<string, unknown>)[key2]),
          ) > -1
        )
      )
    }
  } else {
    return true
  }
  return isEqual(obj, source)
}
