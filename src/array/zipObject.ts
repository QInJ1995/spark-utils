import { each } from '../internal/iterate'

/**
 * 根据键数组、值数组对转换为对象（移植自旧 src/array/zipObject.js）
 *
 * - 键列表经旧 values（Object.values，空入参为 []）取值后逐位配对；
 * - 值数组缺省或不足时补 undefined（fixture 锁定）；
 * - 键会被字符串化作为对象键。
 *
 * @param props 键数组（旧版兼容对象/字符串）
 * @param arr 值数组
 * @returns 键值对对象
 */
export function zipObject(
  props: ReadonlyArray<unknown> | Record<string, unknown> | string | null | undefined,
  arr?: ReadonlyArray<unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const list = (arr || []) as unknown[]
  // 旧 basic/values.js：Object.values 可用即 Object.values，假值入参返回 []
  const keyValues = props ? Object.values(props as object) : []
  each(keyValues, function zipValue(val, key) {
    result[val as string] = list[key as number]
  })
  return result
}
