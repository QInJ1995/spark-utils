/**
 * pick/omit 共享实现（内部模块，对应旧 src/helpers/helperCreatePickOmit.js）
 *
 * 2.0 去重：M3 时期 pick（旧工厂参 (1, 0)）与 omit（旧工厂参 (0, 1)）曾各自
 * 内联为两份逐字相同的实现（仅命中分支极性不同），现收敛回单一工厂。
 * 不进 index.ts 具名导出。
 */
import { each } from '../internal/iterate'
import { isArray, isFunction } from '../internal/type'

/** pick/omit 的函数式筛选回调 */
export type PickOmitCallback = (this: unknown, value: unknown, key: string | number, obj: unknown) => boolean

/** pick/omit 的公共函数形态 */
export type PickOmitFn = (this: unknown, obj: unknown, ...selector: unknown[]) => Record<string, unknown>

/**
 * 创建键过滤函数（keepMatched=true 命中保留〔pick〕，false 命中排除〔omit〕）
 *
 * - 第一参为函数时按 (value, key, obj) 调用做筛选（this 取调用时的上下文）；
 * - 否则把从第一参起的所有参数（数组展平）作为键名列表；
 * - falsy 入参返回 {}。
 */
export function helperCreatePickOmit(keepMatched: boolean): PickOmitFn {
  return function filterProps(this: unknown, obj, ...selector): Record<string, unknown> {
    const rest: Record<string, unknown> = {}
    const keyList: unknown[] = []
    const first = selector[0]
    const callback = isFunction(first) ? (first as PickOmitCallback) : undefined
    if (!callback) {
      for (const item of selector) {
        if (isArray(item)) {
          keyList.push(...item)
        } else {
          keyList.push(item)
        }
      }
    }
    each(obj, (val: unknown, key: string | number) => {
      const matched = callback ? callback.call(this, val, key, obj) : keyList.some((name) => name === key)
      if (keepMatched === matched) {
        rest[key as string] = val
      }
    })
    return rest
  }
}
