/**
 * 函数去抖（移植自旧 src/function/debounce.js）
 *
 * 当被调用 n 毫秒后才会执行，如果在这段时间内又被调用，
 * 则将重新计算执行时间。
 *
 * 已知缺陷修复：旧版首行 `options.leading` 在 options 传 undefined
 * （不传第三参）时直接抛 TypeError（无法读取 undefined 的属性）；
 * 新版 options 参数可选并安全读取（options?.leading），
 * 不传时按布尔分支对 falsy 的语义默认 trailing 执行
 * （leading 不开启、trailing 开启），显式传对象时字段语义与旧版一致
 * （缺省字段视为不开启）。boolean 兼容写法保留：true 等价
 * {leading: true}、false 等价 {trailing: true}。
 */

/** 节流/防抖选项 */
export interface DebounceOptions {
  /** 是否在之前执行 */
  leading?: boolean
  /** 是否在之后执行 */
  trailing?: boolean
}

/** 带取消能力的包装函数 */
export interface CancelableFunction {
  (...args: unknown[]): void
  /** 取消挂起的执行，返回是否存在生效中的定时器 */
  cancel(): boolean
}

/**
 * 函数去抖
 *
 * @param callback 回调
 * @param wait 等待毫秒
 * @param options {leading: 是否在之前执行, trailing: 是否在之后执行}，或布尔简写
 * @returns 防抖后的包装函数（含 cancel）
 */
export function debounce(
  callback: (this: unknown, ...args: unknown[]) => unknown,
  wait: number,
  options?: DebounceOptions | boolean
): CancelableFunction {
  let args: unknown[] | undefined
  let context: unknown
  let runFlag = false
  let timeout: ReturnType<typeof setTimeout> | 0 = 0
  const optLeading = typeof options !== 'boolean' ? options?.leading : options
  const optTrailing = typeof options !== 'boolean' ? (options ? options.trailing : true) : !options
  const runFn = (): void => {
    runFlag = true
    timeout = 0
    callback.apply(context, args ?? [])
  }
  const endFn = (): void => {
    if (optLeading === true) {
      timeout = 0
    }
    if (!runFlag && optTrailing === true) {
      runFn()
    }
  }
  const cancelFn = (): boolean => {
    const rest = timeout !== 0
    clearTimeout(timeout)
    timeout = 0
    return rest
  }
  const debounced = function (this: unknown, ...callArgs: unknown[]): void {
    runFlag = false
    args = callArgs
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- 旧版语义：记录每次调用的 this 供回调使用（runFn 为工厂层箭头函数，无法词法捕获包装函数的 this）
    context = this
    if (timeout === 0) {
      if (optLeading === true) {
        runFn()
      }
    } else {
      clearTimeout(timeout)
    }
    timeout = setTimeout(endFn, wait)
  }
  debounced.cancel = cancelFn
  return debounced
}
