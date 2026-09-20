import { hasOwnProp, isArray } from '../internal/type'

/**
 * 通用包含判断（旧 src/array/includes.js 的内联镜像）
 *
 * 依赖的 includes 已删（原生镜像），字符串/对象分支就地内联：
 * - 有原生 includes（数组/字符串）直接调用；
 * - 其余对象 for-in + hasOwnProp 逐自有值比对；
 * - 空值或其他原始值返回 false。
 */
function includesValue(obj: unknown, val: unknown): boolean {
  if (obj) {
    const target = obj as { includes?: (searchValue: unknown) => unknown }
    if (target.includes) {
      return !!target.includes(val)
    }
    const source = obj as Record<string, unknown>
    for (const key in source) {
      if (hasOwnProp(source, key)) {
        if (val === source[key]) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * 判断数组是否包含另一数组（移植自旧 src/array/includeArrays.js）
 *
 * - 双数组：array2 的每一项都必须在 array1 中（原生 includes，SameValueZero）；
 * - 非双数组：退化为旧通用 includes(array1, array2) 行为——
 *   array1 为字符串时子串判断、为对象时自有值相等判断、其余返回 false。
 *
 * @param array1 数组
 * @param array2 被包含数组
 * @returns 是否包含
 */
export function includeArrays(array1: unknown, array2: unknown): boolean {
  if (isArray(array1) && isArray(array2)) {
    for (let index = 0, len = array2.length; index < len; index++) {
      if (!array1.includes(array2[index])) {
        return false
      }
    }
    return true
  }
  return includesValue(array1, array2)
}
