/**
 * 创建一个函数，调用次数达到 count 次之后执行回调（移植自旧 src/function/after.js）
 *
 * 忠实旧语义：
 * - 前 count 次调用只记录每次实参的首个值（累积进 rests）；
 * - 自第 count 次调用起（含）每次调用都执行回调，回调参数为
 *   (rests, ...当次实参)；
 * - count 传 0 时首次调用即满足条件。
 */

/**
 * 创建一个函数，调用次数超过 count 次之后执行回调并将所有结果记住后返回
 *
 * @param count 调用次数
 * @param callback 完成回调，参数为 (rests, ...args)
 * @param context 回调执行的上下文
 * @returns 包装函数
 */
export function after<A extends unknown[], R>(
  count: number,
  callback: (this: unknown, rests: unknown[], ...args: A) => R,
  context?: unknown
): (...args: A) => void {
  let runCount = 0
  const rests: unknown[] = []
  return (...args: A): void => {
    runCount++
    if (runCount <= count) {
      rests.push(args[0])
    }
    if (runCount >= count) {
      callback.apply(context, [rests, ...args])
    }
  }
}
