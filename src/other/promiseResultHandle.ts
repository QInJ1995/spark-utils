/**
 * promise 对象结果处理（移植自旧 src/other/promiseResultHandle.js）
 *
 * 行为忠实保留（含怪癖）：
 * - 无 promise（或假值）直接返回 undefined；
 * - 结果校验（verifyConfig 逐键全等比对，空配置恒通过）通过：先回调 resolveFn，
 *  再按 resultKey 以 '.' 分段从结果中深取值返回；
 * - 深取值路径中途断裂（如 undefined 继续取键）抛 TypeError，被本函数 catch 后
 *  转为 reject '结果获取错误!'（旧版即如此——取值发生在 try 内）；
 * - 校验不通过 reject '结果校验不通过!'；await 抛错 reject '结果获取错误!'，
 *  两种失败路径都会先回调 rejectFn；
 * - 默认配置经 getSetup().promiseResultConfig 读取（resultKey 'data' / verifyConfig {}），
 *  setup() 后即时生效（等价旧版读可变单例 setupDefaults）。
 */
import { getSetup } from '../internal/config'

/** promiseResultHandle 参数 */
export interface PromiseResultHandleOptions {
  /** 待处理的 promise 对象（假值时直接返回 undefined） */
  promise?: PromiseLike<unknown>
  /** 结果数据 key，支持 '.' 分段深取，默认取 setup 的 promiseResultConfig.resultKey（'data'） */
  resultKey?: string
  /** 校验配置（键值对，逐键与结果全等比对），默认取 setup 的 promiseResultConfig.verifyConfig */
  verifyConfig?: Record<string, unknown>
  /** 校验通过回调 */
  resolveFn?: () => void
  /** 校验不通过 / 结果获取错误回调 */
  rejectFn?: () => void
}

/**
 * 处理 promise 结果：校验通过按 resultKey 深取值，失败统一 reject
 *
 * @param options 配置项
 * @returns 校验通过时为深取的结果数据，否则为 rejected Promise
 */
export async function promiseResultHandle(options: PromiseResultHandleOptions = {}): Promise<unknown> {
  if (!options.promise) {
    return
  }
  const setupConfig = getSetup().promiseResultConfig
  const resultKey = options.resultKey || setupConfig.resultKey || 'data'
  const verifyConfig = options.verifyConfig || setupConfig.verifyConfig || {}
  const rejectFn = options.rejectFn
  const resolveFn = options.resolveFn
  try {
    const result = await options.promise
    const verified = Object.entries(verifyConfig).reduce<boolean>((pre, cur) => {
      if ((result as Record<string, unknown>)[cur[0]] !== cur[1]) {
        return false
      }
      return pre
    }, true)
    if (verified) {
      if (resolveFn) {
        resolveFn()
      }
      // 深取值在 try 内：路径断裂抛 TypeError 会落入下方 catch（与旧版一致）
      return resultKey.split('.').reduce<unknown>((pre, cur) => (pre as Record<string, unknown>)[cur], result)
    }
    if (rejectFn) {
      rejectFn()
    }
    // 注意：此处 return Promise.reject 不会被本层 catch 捕获（原生 async 的 promise 采纳语义）
    return Promise.reject(new Error('[spark-utils][promiseResultHandle]: 结果校验不通过!'))
  } catch {
    if (rejectFn) {
      rejectFn()
    }
    return Promise.reject(new Error('[spark-utils][promiseResultHandle]: 结果获取错误!'))
  }
}
