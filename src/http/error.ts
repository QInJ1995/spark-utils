/**
 * HTTP 请求错误（2.0 类型化错误）
 *
 * 请求失败（非 2xx 响应）与请求超时原先抛裸 Error（仅 message 携带信息），
 * 调用方无法程序化区分错误类别；2.0 起抛 HttpError：
 * - kind='http'：收到完整响应但非 2xx（status 携带状态码）；
 * - kind='timeout'：超时经 AbortController 中止（timeout 携带毫秒数）。
 * message 文案与裸 Error 时期逐字一致（测试与既有匹配逻辑不受影响）。
 * 外部 signal 取消、fetch 网络错误仍抛原生错误（不经本类型包装）。
 */

/** 错误类别：http=非 2xx 响应；timeout=请求超时中止 */
export type HttpErrorKind = 'http' | 'timeout'

/** HTTP 请求错误（非 2xx 响应或超时） */
export class HttpError extends Error {
  /** 错误类别 */
  readonly kind: HttpErrorKind
  /** 请求的完整地址（已拼接 baseURL 与查询参数） */
  readonly url: string
  /** HTTP 状态码（kind='http' 时存在） */
  readonly status?: number
  /** 超时毫秒数（kind='timeout' 时存在） */
  readonly timeout?: number

  constructor(
    kind: HttpErrorKind,
    message: string,
    info: { url: string; status?: number; timeout?: number },
  ) {
    super(message)
    this.name = 'HttpError'
    this.kind = kind
    this.url = info.url
    if (info.status !== undefined) {
      this.status = info.status
    }
    if (info.timeout !== undefined) {
      this.timeout = info.timeout
    }
  }
}
