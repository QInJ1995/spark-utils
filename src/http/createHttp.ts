/**
 * createHttp —— 基于原生 fetch 的请求封装（2.0 新增，Node 18+ / 浏览器同构）
 *
 * MIGRATION（旧 src/https/ 的 axios 封装 → 新 http 域）：
 * - 旧 https.init(options) 创建 axios 实例并 monkey-patch 挂载 SparkUtils.https.submit（全局单例），
 *   新 API 为 createHttp(config) 返回独立实例 { get, post, put, delete, submit }，可创建多个互不影响；
 * - 旧拦截器 interceptors.request / interceptors.response → 新钩子 config.beforeRequest / afterResponse：
 *   beforeRequest 返回（或 Promise 解析为）新 HttpRequestInit 即替换最终请求，返回空则沿用；
 *   afterResponse 在每个收到完整响应（含 4xx/5xx，不含网络错误/超时）后以 HttpResponse 通知；
 * - 旧 response 拦截器「默认返回 responseRes.data」的行为内建：便捷方法直接返回反序列化数据（Promise<T>）；
 * - 旧 submit 的 autoQs 开关删除：data 为对象时统一 JSON 序列化，且在调用方未显式指定
 *   Content-Type 时自动置 application/json; charset=UTF-8（显式传入的 Content-Type 恒优先）；
 * - 旧 https.axios 透出的 axios 实例不再提供（需要 axios 的场景请自行引入）；
 * - 默认配置槽：baseURL / timeout / headers 三层（请求级 > 实例级 > setup().httpConfig），
 *   setup 槽即旧 setupDefaults.axiosConfig（10000ms 超时、默认表单 Content-Type），
 *   每次请求时读取，setup() 后立即生效；
 * - 超时经 AbortController 中止；外部 signal 与超时联动（任一触发即中止请求）。
 */
import { getSetup } from '../internal/config'
import { isString } from '../internal/type'
import type {
  HttpConfig,
  HttpInstance,
  HttpMethod,
  HttpRequestConfig,
  HttpRequestInit,
  HttpResponse,
} from '../types/http'

/** 绝对地址（scheme://）判定，命中的 url 不拼接 baseURL */
const absoluteUrlRE = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//

/** 拼接 baseURL 与查询参数 */
function buildURL(baseURL: string, url: string, params: Record<string, string> | undefined): string {
  let fullURL = url
  if (baseURL !== '' && !absoluteUrlRE.test(url)) {
    fullURL = `${baseURL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
  }
  if (params) {
    const query = new URLSearchParams(params).toString()
    if (query !== '') {
      fullURL += (fullURL.includes('?') ? '&' : '?') + query
    }
  }
  return fullURL
}

/** headers 中是否显式含有 Content-Type（大小写不敏感；setup 默认头不算显式） */
function hasExplicitContentType(headers: Record<string, string> | undefined): boolean {
  if (!headers) {
    return false
  }
  return Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')
}

/**
 * 创建请求实例
 *
 * @param config 实例级配置（baseURL/timeout/headers/钩子），缺省项回落到 setup().httpConfig
 */
export function createHttp(config: HttpConfig = {}): HttpInstance {
  /**
   * 统一请求通道：拼地址 → 组请求头 → 序列化请求体 → beforeRequest 钩子 →
   * 超时/外部信号接线 → fetch → 反序列化 → afterResponse 钩子 → 返回数据
   */
  async function request<T>(
    method: HttpMethod,
    url: string,
    data: unknown,
    requestConfig: HttpRequestConfig | undefined,
  ): Promise<T> {
    const setupHttpConfig = getSetup().httpConfig
    const timeout = requestConfig?.timeout ?? config.timeout ?? setupHttpConfig.timeout
    const headers: Record<string, string> = {
      ...setupHttpConfig.headers,
      ...config.headers,
      ...requestConfig?.headers,
    }
    const fullURL = buildURL(config.baseURL ?? setupHttpConfig.baseURL, url, requestConfig?.params)

    // 请求体：GET/HEAD 不携带；字符串原样；其余 JSON 序列化并自动置 JSON 头
    const init: HttpRequestInit = { method, url: fullURL, headers, timeout }
    if (data !== undefined && method !== 'GET' && method !== 'HEAD') {
      if (isString(data)) {
        init.body = data
      } else {
        init.body = JSON.stringify(data)
        if (!hasExplicitContentType(config.headers) && !hasExplicitContentType(requestConfig?.headers)) {
          headers['Content-Type'] = 'application/json; charset=UTF-8'
        }
      }
    }
    if (requestConfig?.signal) {
      init.signal = requestConfig.signal
    }

    // beforeRequest 钩子：返回新 init 则替换
    let finalInit = init
    const beforeRequest = config.beforeRequest
    if (beforeRequest) {
      const returned = await beforeRequest(init)
      if (typeof returned === 'object' && returned !== null) {
        finalInit = returned
      }
    }

    // 超时与外部取消共用同一 AbortController（任一触发即中止）
    const controller = new AbortController()
    const externalSignal = finalInit.signal
    const onExternalAbort = (): void => controller.abort()
    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort()
      } else {
        externalSignal.addEventListener('abort', onExternalAbort)
      }
    }
    let timedOut = false
    const timer =
      finalInit.timeout > 0
        ? setTimeout(() => {
            timedOut = true
            controller.abort()
          }, finalInit.timeout)
        : undefined

    try {
      const fetchInit: { method: string; headers: Record<string, string>; body?: string; signal?: AbortSignal } = {
        method: finalInit.method,
        headers: finalInit.headers,
      }
      if (finalInit.body !== undefined) {
        fetchInit.body = finalInit.body
      }
      if (finalInit.timeout > 0 || externalSignal) {
        fetchInit.signal = controller.signal
      }
      const response = await fetch(finalInit.url, fetchInit)

      // 响应头投影 + 按 content-type 反序列化
      const responseHeaders: Record<string, string> = {}
      for (const pair of response.headers as unknown as Iterable<readonly [string, string]>) {
        responseHeaders[pair[0]] = pair[1]
      }
      const contentType = responseHeaders['content-type'] ?? ''
      const bodyData: unknown = contentType.includes('json') ? await response.json() : await response.text()

      const afterResponse = config.afterResponse
      if (afterResponse) {
        await afterResponse({
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          data: bodyData,
        } satisfies HttpResponse<unknown>)
      }
      if (!response.ok) {
        throw new Error(`[spark-utils][http]: 请求失败（${response.status}）${finalInit.url}`)
      }
      return bodyData as T
    } catch (error) {
      if (timedOut) {
        throw new Error(`[spark-utils][http]: 请求超时（${finalInit.timeout}ms）${finalInit.url}`)
      }
      throw error
    } finally {
      if (timer !== undefined) {
        clearTimeout(timer)
      }
      if (externalSignal) {
        externalSignal.removeEventListener('abort', onExternalAbort)
      }
    }
  }

  /** get/delete 的查询参数并入请求级配置 */
  function withParams(
    params: Record<string, string> | undefined,
    requestConfig: HttpRequestConfig | undefined,
  ): HttpRequestConfig | undefined {
    if (params === undefined) {
      return requestConfig
    }
    return { ...requestConfig, params }
  }

  return {
    get: (url, params, requestConfig) => request('GET', url, undefined, withParams(params, requestConfig)),
    post: (url, data, requestConfig) => request('POST', url, data, requestConfig),
    put: (url, data, requestConfig) => request('PUT', url, data, requestConfig),
    delete: (url, params, requestConfig) => request('DELETE', url, undefined, withParams(params, requestConfig)),
    submit: (options) => {
      if (!options.url) {
        return Promise.reject(new Error('[spark-utils][http][submit]: 请传入url参数!'))
      }
      return request(options.method ?? 'POST', options.url, options.data, options)
    },
  }
}
