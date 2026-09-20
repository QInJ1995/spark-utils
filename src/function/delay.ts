/**
 * 延迟执行（移植自旧 src/function/delay.js）
 *
 * 该方法和 setTimeout 一样的效果，区别就是支持上下文和额外参数：
 * - context 取调用 delay 时的 this（模块内直调时为 undefined）；
 * - 第三参起作为回调参数原样透传；
 * - 返回定时器 id（浏览器为 number，Node 为 Timeout 对象，故用 ReturnType 收敛）。
 */

/**
 * 延迟 wait 毫秒后执行回调
 *
 * @param this 回调执行时的上下文
 * @param callback 回调函数
 * @param wait 延迟毫秒
 * @param args 额外的参数
 * @returns 定时器 id
 */
export function delay(
  this: unknown,
  callback: (this: unknown, ...args: unknown[]) => unknown,
  wait: number,
  ...args: unknown[]
): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    // 回调在定时器触发时执行：箭头函数词法捕获调用 delay 时的 this 作为上下文
    callback.apply(this, args)
  }, wait)
}
