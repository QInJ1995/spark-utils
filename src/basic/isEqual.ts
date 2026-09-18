import { defaultCompare, helperEqualCompare } from '../internal/compare'

/**
 * 深度比较两个对象之间的值是否相等
 *
 * 语义（含 NaN 怪癖）由 internal/compare 的 helperEqualCompare 忠实保留：
 * NaN 与 NaN 不相等（最终经 v1 === v2 判定为 false）；RegExp 按字符串化比较、
 * Date/Boolean 按数值化比较；数组与对象按键序逐一递归。
 *
 * @param obj1 值 1
 * @param obj2 值 2
 * @returns 相等为 true
 */
export function isEqual(obj1: unknown, obj2: unknown): boolean {
  return helperEqualCompare(obj1, obj2, defaultCompare)
}
