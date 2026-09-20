import { objectEach } from '../internal/iterate'
import { groupBy } from './groupBy'

/**
 * 集合分组统计,返回各组中对象的数量统计（移植自旧 src/array/countBy.js）
 *
 * 先 groupBy 分组，再把各组替换为组内元素数量。
 * 旧版 `context || this` 中模块顶层 this 为 undefined，故等价于直接透传 context。
 *
 * @param obj 数组（旧版经 each 兼容对象）
 * @param iterate 回调/对象属性
 * @param context 上下文
 * @returns 各组数量统计对象
 */
export function countBy<T>(
  obj: ReadonlyArray<T> | object | null | undefined,
  iterate?:
    | ((this: unknown, item: T, key: string | number, obj: unknown) => unknown)
    | string
    | number
    | object
    | undefined,
  context?: unknown
): Record<string, number> {
  // 旧版在 groupBy 结果上原地把各组替换为长度；值类型变化故经 unknown 中转
  const result: Record<string, unknown> = groupBy(obj, iterate, context)
  objectEach(result, function countGroup(item, key) {
    result[key] = (item as unknown[]).length
  })
  return result as Record<string, number>
}
