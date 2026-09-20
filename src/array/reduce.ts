/**
 * 接收一个函数作为累加器，数组中的每个值（从左到右）开始合并，最终为一个值。
 * （移植自旧 src/array/reduce.js）
 *
 * - 数组且长度非 0 且有原生 reduce：走原生（this 绑定为 null），
 *   初始值语义与原生一致；
 * - 其余（对象/空数组等）走 keys 回退分支；
 * - 怪癖忠实保留（fixture 锁定）：
 *   - 回退分支中初始值被丢弃：previous 取第一个键的值，从第二个键开始迭代
 *     （对象 reduce({a:1,b:2,c:3}, cb, 0) 实际从 1 起累加得 6）；
 *   - 空数组 + 初始值走回退分支后 previous = array[undefined] = undefined，
 *     返回 undefined；
 * - array 为空返回 undefined。
 *
 * @param array 数组/对象
 * @param callback(previous, item, index, array) 累加回调
 * @param initialValue 初始值（仅原生分支生效）
 * @returns 累加结果
 */
export function reduce<T, R>(
  array: readonly T[] | null | undefined,
  callback: (this: unknown, previous: R, item: T, index: number, array: T[]) => R,
  initialValue?: R
): R | undefined
export function reduce<T extends object, R>(
  array: T | null | undefined,
  callback: (this: unknown, previous: R, item: T[keyof T], index: number, array: T) => R,
  initialValue?: R
): R | undefined
export function reduce(array: unknown, callback: unknown, initialValue?: unknown): unknown {
  if (array) {
    const cb = callback as (
      this: unknown,
      previous: unknown,
      item: unknown,
      index: number,
      array: unknown
    ) => unknown
    let index = 0
    // 旧版 context 恒为 null（callback.apply(null, ...)），忠实保留
    const context = null
    let previous = initialValue
    const isInitialVal = arguments.length > 2
    // 旧 keys.js：Object.keys 可用即 Object.keys，假值返回 []（此处 obj 已真值）
    const keyList = Object.keys(array as object)
    const target = array as Record<string, unknown> & { length?: unknown; reduce?: unknown }
    if (target.length && target.reduce) {
      const native = array as {
        reduce: (
          cb: (previous: unknown, current: unknown, currentIndex: number, arr: unknown) => unknown,
          initialValue?: unknown
        ) => unknown
      }
      const reduceMethod = function reduceWrap(
        prev: unknown,
        current: unknown,
        currentIndex: number,
        arr: unknown
      ): unknown {
        return cb.call(context, prev, current, currentIndex, arr)
      }
      if (isInitialVal) {
        return native.reduce(reduceMethod, previous)
      }
      return native.reduce(reduceMethod)
    }
    if (isInitialVal) {
      index = 1
      // 怪癖：初始值被丢弃，取第一个键的值作为 previous（空数组时为 undefined）
      previous = target[keyList[0] as string]
    }
    for (let len = keyList.length; index < len; index++) {
      previous = cb.call(context, previous, target[keyList[index] as string], index, array)
    }
    return previous
  }
  return undefined
}
