import { each } from '../internal/iterate'
import { helperNumberAdd } from '../internal/number'
import { getValueByPath } from '../internal/paths'
import { isFunction } from '../internal/type'

/**
 * 求和函数，将数值相加（移植自旧 src/array/sum.js）
 *
 * - 加法走 internal/number 的精度修正 helperNumberAdd（0.1 + 0.2 === 0.3）；
 * - iterate 为函数按回调返回值累加；为字符串/数字按路径取值累加；
 *   为空按原值累加；
 * - 怪癖忠实保留：非数字项经字符串化 + parseFloat 归 0 计入
 *   （[1, 'a', 3] === 4，fixture 锁定）；
 * - 空入参返回 0。
 *
 * @param array 数组（旧版经 each 兼容对象）
 * @param iterate 方法或属性路径
 * @param context 上下文
 * @returns 求和结果
 */
export function sum(
  array: ReadonlyArray<unknown> | Record<string, unknown> | null | undefined,
  iterate?: ((this: unknown, item: unknown, key: string | number, obj: unknown) => unknown) | string | number,
  context?: unknown
): number {
  let result = 0
  const fnIterate = isFunction(iterate)
    ? (iterate as (this: unknown, item: unknown, key: string | number, obj: unknown) => unknown)
    : undefined
  const pathIterate = !fnIterate && iterate ? (iterate as string | number) : undefined
  each(array, function sumItem(val, key) {
    // internal 形参收窄为 number|string：运行时任意值经 ''+ 字符串化后
    // 由 toNumber/parseFloat 归 0（旧版非数字计 0 语义不变），断言仅为通过类型检查
    if (fnIterate) {
      result = helperNumberAdd(result, fnIterate.call(context, val, key, array) as number | string)
    } else if (pathIterate !== undefined) {
      result = helperNumberAdd(result, getValueByPath(val, pathIterate) as number | string)
    } else {
      result = helperNumberAdd(result, val as number | string)
    }
  })
  return result
}
