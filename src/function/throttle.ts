/**
 * 节流函数（移植自旧 src/function/throttle.js）
 *
 * 当被调用 n 毫秒后才会执行，如果在这段时间内又被调用，
 * 则至少每隔 n 毫秒调用一次该函数。
 *
 * 已知缺陷修复（与 debounce 同型）：旧版 `options.leading` 在 options
 * 传 undefined（不传第三参）时抛 TypeError；新版 options 参数可选并安全读取，
 * 不传时按布尔分支对 falsy 的语义默认 trailing 执行
 * （leading 不开启、trailing 开启），显式传对象时字段语义与旧版一致
 * （缺省字段视为不开启）。boolean 兼容写法保留：true 等价
 * {leading: true}、false 等价 {trailing: true}。
 */

import type { CancelableFunction } from './debounce'

/** 节流/防抖选项 */
export interface ThrottleOptions {
  /** 是否在之前执行 */
  leading?: boolean
  /** 是否在之后执行 */
  trailing?: boolean
}

/**
 * 节流函数
 *
 * @param callback 回调
 * @param wait 间隔毫秒
 * @param options {leading: 是否在之前执行, trailing: 是否在之后执行}，或布尔简写
 * @returns 节流后的包装函数（含 cancel）
 */
export function throttle<A extends unknown[], R>(
  callback: (this: unknown, ...args: A) => R,
  wait: number,
  options?: ThrottleOptions | boolean
): CancelableFunction<A> {
  let args: A | undefined
  let context: unknown
  let runFlag = false
  let timeout: ReturnType<typeof setTimeout> | 0 = 0
  const optLeading = typeof options !== 'boolean' ? options?.leading : options
  const optTrailing = typeof options !== 'boolean' ? (options ? options.trailing : true) : !options
  const runFn = (): void => {
    runFlag = true
    // 空参兜底（runFn 触发路径必先有调用记录 args，纯防御）
    callback.apply(context, args ?? ([] as unknown as A))
    timeout = setTimeout(endFn, wait)
  }
  const endFn = (): void => {
    timeout = 0
    if (!runFlag && optTrailing === true) {
      runFn()
    }
  }
  const cancelFn = (): boolean => {
    const rest = timeout !== 0
    clearTimeout(timeout)
    runFlag = false
    timeout = 0
    return rest
  }
  const throttled = function (this: unknown, ...callArgs: A): void {
    args = callArgs
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- 旧版语义：记录每次调用的 this 供回调使用（runFn 为工厂层箭头函数，无法词法捕获包装函数的 this）
    context = this
    runFlag = false
    if (timeout === 0) {
      if (optLeading === true) {
        runFn()
      } else if (optTrailing === true) {
        timeout = setTimeout(endFn, wait)
      }
    }
  }
  throttled.cancel = cancelFn
  return throttled
}
