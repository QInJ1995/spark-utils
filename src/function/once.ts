/**
 * 创建一个只能调用一次的函数（移植自旧 src/function/once.js）
 *
 * 忠实旧语义：
 * - 只有第一次调用会执行回调（当次实参在前、创建时附加参数在后拼接传入），
 *   之后的所有调用直接返回第一次的结果（缓存值）；
 * - 回调首次执行抛错则不计为"已执行"，下次调用会重试；
 * - context 为回调执行时的 this。
 */

/**
 * 创建一个只能调用一次的函数，只会返回第一次执行后的结果
 *
 * @param callback 函数
 * @param context 上下文
 * @param presetArgs 创建时附加的参数（拼在当次实参之后）
 * @returns 只执行一次的包装函数
 */
export function once<A extends unknown[], R>(
  callback: (this: unknown, ...args: A) => R,
  context?: unknown,
  ...presetArgs: unknown[]
): (...args: A) => R {
  let done = false
  let rest: R | undefined
  return (...args: A): R => {
    if (done) {
      return rest as R
    }
    rest = callback.apply(context, [...args, ...presetArgs] as A) as R
    done = true
    return rest
  }
}
