import { each } from '../internal/iterate'
import { isEmpty, isFunction, isNull, isObject } from '../internal/type'

/**
 * 集合分组,默认使用键值分组,如果有iterate则使用结果进行分组（移植自旧 src/array/groupBy.js）
 *
 * iterate 三形态（旧 createiterateEmpty/property 内联）：
 * - 对象（含数组/Date 等 typeof 'object'）：以 isEmpty(iterate) 的布尔结果为键；
 * - 非函数其余值（含 undefined）：以 val[name] 为键——name 为 undefined 时
 *   全部归入 "undefined" 键（怪癖忠实保留，fixture 锁定）；null 项为 undefined 键值；
 * - 函数：以回调返回值为键。
 *
 * 键会被字符串化；obj 为空返回 {}。
 *
 * @param obj 数组（旧版经 each 兼容对象）
 * @param iterate 回调/对象属性
 * @param context 上下文
 * @returns 分组结果对象
 */
export function groupBy<T>(
  obj: ReadonlyArray<T> | object | null | undefined,
  iterate?:
    | ((this: unknown, item: T, key: string | number, obj: unknown) => unknown)
    | string
    | number
    | object
    | undefined,
  context?: unknown
): Record<string, T[]> {
  const result: Record<string, T[]> = {}
  if (obj) {
    const fnIterate = isFunction(iterate)
      ? (iterate as (this: unknown, item: unknown, key: string | number, obj: unknown) => unknown)
      : undefined
    const emptyIterate = !fnIterate && iterate && isObject(iterate) ? iterate : undefined
    // 旧 property(iterate)：非对象非函数的其余值（含 undefined）按属性名取值
    const propName = !fnIterate && emptyIterate === undefined ? (iterate as string | undefined) : undefined
    each(obj, function groupItem(val, key) {
      let groupKey: unknown
      if (fnIterate) {
        groupKey = fnIterate.call(context, val, key, obj)
      } else if (emptyIterate !== undefined) {
        groupKey = isEmpty(emptyIterate)
      } else {
        groupKey = isNull(val) ? undefined : (val as Record<string, unknown>)[propName as string]
      }
      const group = result[groupKey as string]
      if (group) {
        group.push(val as T)
      } else {
        result[groupKey as string] = [val as T]
      }
    })
  }
  return result
}
