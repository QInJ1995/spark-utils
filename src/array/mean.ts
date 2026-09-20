import { each } from '../internal/iterate'
import { helperNumberDivide } from '../internal/number'
import { isArray, isString } from '../internal/type'
import { sum } from './sum'

/**
 * 求长度（旧 src/basic/getSize.js 的内联：字符串/数组取 length，其余按 each 计数）
 */
function getSize(obj: unknown): number {
  if (isString(obj) || isArray(obj)) {
    return (obj as string | unknown[]).length
  }
  let len = 0
  each(obj, function countSize() {
    len++
  })
  return len
}

/**
 * 求平均值函数（移植自旧 src/array/mean.js）
 *
 * 除法走 internal/number 的精度修正 helperNumberDivide。
 * 怪癖忠实保留（fixture 锁定）：
 * - 空数组 sum=0 / size=0，0/0 经 NaN 归 0 得 0；
 * - 非数字项按 0 计入但占分母（[1, 'a'] === 0.5）。
 *
 * @param array 数组（旧版经 each 兼容对象）
 * @param iterate 方法或属性路径
 * @param context 上下文
 * @returns 平均值
 */
export function mean(
  array: ReadonlyArray<unknown> | Record<string, unknown> | null | undefined,
  iterate?: ((this: unknown, item: unknown, key: string | number, obj: unknown) => unknown) | string | number,
  context?: unknown
): number {
  return helperNumberDivide(sum(array, iterate, context), getSize(array))
}
