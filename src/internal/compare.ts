import { isArray, isNumber, isString, isUndefined } from './type'

/**
 * 比较器完整形态：旧实现会以 (v1, v2, key, obj1, obj2) 五参调用 compare
 * （defaultCompare 等只消费前两个参数）。
 */
export type CompareFn = (
  v1: unknown,
  v2: unknown,
  key: string | number | undefined,
  obj1?: unknown,
  obj2?: unknown
) => boolean | undefined

/** 内部加宽形态：compare 声明为两参（按约定签名），但调用点逐字保留旧实现的五参调用 */
type FullCompareFn = (
  v1: unknown,
  v2: unknown,
  key: string | number | undefined,
  obj1?: unknown,
  obj2?: unknown
) => boolean

/**
 * 以下类型守卫为本地实现：'./type' 约定导出中未包含这些符号，
 * 语义与旧版一致（isRegExp/isDate 走 Object.prototype.toString，isBoolean 走 typeof）。
 */
function isRegExp(value: unknown): value is RegExp {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}

function isDate(value: unknown): value is Date {
  return Object.prototype.toString.call(value) === '[object Date]'
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/** 旧实现直接读取 .constructor（null 原型对象得到 undefined，不抛错） */
function getConstructor(value: unknown): unknown {
  return (value as { constructor?: unknown }).constructor
}

/**
 * 深度相等比较（移植自 src/helpers/helperEqualCompare.js）
 *
 * 执行顺序与比较语义逐字忠实于旧实现：
 * - 严格相等直接 true；
 * - 双方 truthy 且非 number/string 才进入结构比较；
 * - RegExp → 字符串化后交 compare；Date/Boolean → +v 数值化后交 compare；
 * - 数组与非数组不相等；非数组时 constructor 一致才比 keys；
 * - keys 长度不等 false；func 结果非 undefined 时以 !!result 定论；
 *   否则逐 key 递归（数组用索引、对象用键名作为递归 key）；
 * - 其余情形兜底交 compare。
 *
 * @param val1 值 1
 * @param val2 值 2
 * @param compare 比较器（签名按约定收窄为两参，实际调用为五参）
 * @param func 自定义结构比较，返回 undefined 表示交回默认递归
 * @param key 当前比较所处的键/索引
 * @param obj1 所属对象 1
 * @param obj2 所属对象 2
 */
export function helperEqualCompare(
  val1: unknown,
  val2: unknown,
  compare: (v1: unknown, v2: unknown) => boolean,
  func?: (v1: unknown, v2: unknown, key?: string | number) => boolean | undefined,
  key?: string | number,
  obj1?: unknown,
  obj2?: unknown
): boolean {
  const fullCompare = compare as FullCompareFn
  if (val1 === val2) {
    return true
  }
  if (val1 && val2 && !isNumber(val1) && !isNumber(val2) && !isString(val1) && !isString(val2)) {
    if (isRegExp(val1)) {
      return fullCompare('' + val1, '' + val2, key, obj1, obj2)
    }
    if (isDate(val1) || isBoolean(val1)) {
      return fullCompare(+val1, +val2, key, obj1, obj2)
    }
    const isObj1Arr = isArray(val1)
    const isObj2Arr = isArray(val2)
    if ((isObj1Arr || isObj2Arr) ? (isObj1Arr && isObj2Arr) : getConstructor(val1) === getConstructor(val2)) {
      const val1Keys = Object.keys(val1 as object)
      const val2Keys = Object.keys(val2 as object)
      let result: boolean | undefined
      if (func) {
        result = func(val1, val2, key)
      }
      if (val1Keys.length === val2Keys.length) {
        if (isUndefined(result)) {
          // 局部 every：与旧 array/every 语义一致（空数组 → true，遇 falsy 即 false）
          for (let index = 0; index < val1Keys.length; index++) {
            const key1 = val1Keys[index]
            const key2 = val2Keys[index]
            if (key1 === undefined || key2 === undefined || key1 !== key2) {
              return false
            }
            if (!helperEqualCompare(
              (val1 as Record<string, unknown>)[key1],
              (val2 as Record<string, unknown>)[key2],
              compare,
              func,
              (isObj1Arr || isObj2Arr) ? index : key1,
              val1,
              val2
            )) {
              return false
            }
          }
          return true
        }
        return !!result
      }
      return false
    }
  }
  return fullCompare(val1, val2, key, obj1, obj2)
}

/**
 * 默认比较器（移植自 src/helpers/helperDefaultCompare.js）
 *
 * @param v1 值 1
 * @param v2 值 2
 */
export function defaultCompare(v1: unknown, v2: unknown): boolean {
  return v1 === v2
}
