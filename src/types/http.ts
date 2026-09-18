/**
 * http 域公共类型（2.0 新增）
 *
 * 类型自持：主包 tsconfig 无 DOM lib，此处不 import DOM 的 RequestInit/Response/Headers，
 * 只定义 fetch 封装所需的最小结构（AbortSignal 为 Node 18+/浏览器共有的全局类型，
 * 由 @types/node / DOM 环境各自声明，此处直接引用全局名）。
 */

/** HTTP 方法（大写；createHttp 的便捷方法与 submit 均以此约束） */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

/**
 * 最小请求描述（发送给 fetch 前的最终形态，也是 beforeRequest 钩子的入参/返回形态）
 *
 * - url：已拼接 baseURL 与查询串的完整地址；
 * - body：已序列化（JSON.stringify 或原样字符串）的请求体，GET/HEAD 无；
 * - timeout：超时毫秒数，0 表示不超时。
 */
export interface HttpRequestInit {
  /** 请求方法（大写） */
  method: HttpMethod
  /** 完整请求地址（已拼接 baseURL 与查询参数） */
  url: string
  /** 请求头（已完成 setup / 实例级 / 请求级三层合并） */
  headers: Record<string, string>
  /** 已序列化的请求体（GET/HEAD 请求无此字段） */
  body?: string
  /** 超时毫秒数（0 表示不超时） */
  timeout: number
  /** 调用方传入的外部取消信号 */
  signal?: AbortSignal
}

/** 响应（fetch Response 的最小同构投影 + 反序列化结果，也是 afterResponse 钩子的入参） */
export interface HttpResponse<T = unknown> {
  /** 是否为 2xx 成功响应 */
  ok: boolean
  /** HTTP 状态码 */
  status: number
  /** 状态文本（可能为空串） */
  statusText: string
  /** 响应头（键保留服务端返回的大小写形式） */
  headers: Record<string, string>
  /** 反序列化后的响应体（content-type 含 json 时为解析结果，否则为原始文本） */
  data: T
}

/** createHttp 的实例级配置（缺省项回落到 setup().httpConfig 配置槽） */
export interface HttpConfig {
  /** 基础地址，拼接在相对 url 前 */
  baseURL?: string
  /** 超时毫秒数（0 表示不超时），默认取 setup().httpConfig.timeout（10000） */
  timeout?: number
  /** 实例级默认请求头（覆盖 setup 默认头，被请求级请求头覆盖） */
  headers?: Record<string, string>
  /**
   * 请求前钩子（替代旧 axios 的 interceptors.request）
   * 返回（或 Promise 解析为）新的 HttpRequestInit 可替换最终请求；返回 void/undefined 则沿用原请求。
   */
  beforeRequest?: (request: HttpRequestInit) => HttpRequestInit | Promise<HttpRequestInit> | void
  /** 响应后钩子（替代旧 axios 的 interceptors.response）：每个收到完整响应（含 4xx/5xx）后通知一次 */
  afterResponse?: (response: HttpResponse<unknown>) => void | Promise<void>
}

/** 请求级配置（get/post/put/delete/submit 的附加参数） */
export interface HttpRequestConfig {
  /** 查询参数（序列化后拼接到 url） */
  params?: Record<string, string>
  /** 请求级请求头（优先级最高） */
  headers?: Record<string, string>
  /** 请求级超时毫秒数（优先级最高；0 表示不超时） */
  timeout?: number
  /** 外部取消信号（超时中止与之联动） */
  signal?: AbortSignal
}

/** submit 的参数（旧 https.submit 选项的同构化形态，autoQs 已删除） */
export interface HttpSubmitOptions extends HttpRequestConfig {
  /** 请求地址（必传，缺省时 reject） */
  url: string
  /** 请求方法，默认 POST */
  method?: HttpMethod
  /** 请求体：对象自动 JSON 序列化并置 JSON 头，字符串原样发送 */
  data?: unknown
}

/** createHttp 返回的请求实例 */
export interface HttpInstance {
  /** GET 请求（第二参为查询参数），返回反序列化后的响应体 */
  get<T = unknown>(url: string, params?: Record<string, string>, config?: HttpRequestConfig): Promise<T>
  /** POST 请求（第二参为请求体），返回反序列化后的响应体 */
  post<T = unknown>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>
  /** PUT 请求（第二参为请求体），返回反序列化后的响应体 */
  put<T = unknown>(url: string, data?: unknown, config?: HttpRequestConfig): Promise<T>
  /** DELETE 请求（第二参为查询参数），返回反序列化后的响应体 */
  delete<T = unknown>(url: string, params?: Record<string, string>, config?: HttpRequestConfig): Promise<T>
  /** 统一提交入口（默认 POST），返回反序列化后的响应体 */
  submit<T = unknown>(options: HttpSubmitOptions): Promise<T>
}
