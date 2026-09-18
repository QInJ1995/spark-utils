import { defaultCompare, helperEqualCompare } from '../internal/compare'
import { isFunction, isUndefined } from '../internal/type'

/**
 * isEqualWith 的自定义比较函数
 *
 * 旧实现存在两条调用路径，参数形态不同：
 * - 叶子比较（compare 位）：以 (v1, v2, key, obj1, obj2) 五参调用；
 * - 结构比较（func 位）：以 (v1, v2, key) 三参调用（顶层比较时 key 为 undefined）。
 * 返回 undefined 表示交回默认比较（v1 === v2），其余按真值判定。
 */
export type EqualCustomizer = (
  v1: unknown,
  v2: unknown,
  key?: string | number,
  obj1?: unknown,
  obj2?: unknown
) => boolean | undefined

/**
 * 深度比较两个对象之间的值是否相等，使用自定义比较函数
 *
 * 忠实旧实现的包装语义：func 同时挂到 compare 位与 func 位——
 * 自定义函数返回 undefined 时回落 v1 === v2，返回其他值按 !!result 定论；
 * 顶层（key 为 undefined）返回 false 会短路深比较；
 * 双方 === 严格相等时先行返回 true，自定义函数被跳过；
 * func 不是函数时退化为 isEqual。
 *
 * @param obj1 值 1
 * @param obj2 值 2
 * @param func 自定义比较函数
 * @returns 相等为 true
 */
export function isEqualWith(obj1: unknown, obj2: unknown, func: EqualCustomizer): boolean {
  if (isFunction(func)) {
    return helperEqualCompare(
      obj1,
      obj2,
      (v1: unknown, v2: unknown, key?: string | number, o1?: unknown, o2?: unknown): boolean => {
        const result = func(v1, v2, key, o1, o2)
        return isUndefined(result) ? defaultCompare(v1, v2) : !!result
      },
      func,
    )
  }
  return helperEqualCompare(obj1, obj2, defaultCompare)
}
