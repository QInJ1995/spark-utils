/**
 * 创建一个函数，调用次数不超过 count 次之前执行回调（移植自旧 src/function/before.js）
 *
 * 忠实旧语义：
 * - 仅前 count - 1 次调用执行回调（runCount < count），回调参数为
 *   (rests, ...当次实参)，rests 累积每次实参的首个值；
 * - context 缺省时回退到创建 before 时的 this；
 * - count 传 0 时永不执行回调。
 */

/**
 * 创建一个函数，调用次数不超过 count 次之前执行回调并将所有结果记住后返回
 *
 * @param this context 缺省时的回退上下文
 * @param count 调用次数
 * @param callback 完成回调，参数为 (rests, ...args)
 * @param context 回调执行的上下文
 * @returns 包装函数
 */
export function before(
  this: unknown,
  count: number,
  callback: (this: unknown, rests: unknown[], ...args: unknown[]) => unknown,
  context?: unknown
): (...args: unknown[]) => void {
  let runCount = 0
  const rests: unknown[] = []
  const ctx = context || this
  return (...args: unknown[]): void => {
    runCount++
    if (runCount < count) {
      rests.push(args[0])
      callback.apply(ctx, [rests, ...args])
    }
  }
}
