/**
 * http 模块测试（M5：createHttp 行为锁定，node 环境）
 *
 * fetch 经 vi.stubGlobal 打桩（原生 Response 构造响应），覆盖：
 * get/post/put/delete/submit 五个便捷方法、baseURL 与查询参数拼接、三层请求头合并
 * （请求级 > 实例级 > setup 默认槽）、对象体的 JSON 序列化与自动 JSON 头（显式头优先）、
 * 字符串体的表单默认头剥离、文本响应透传、beforeRequest（整体/部分替换）与
 * afterResponse 钩子、非 2xx 抛错、AbortController 超时中止（vi.useFakeTimers）
 * 与外部 signal 联动、超时判定收紧（4xx/钩子错误与计时器竞态不误报超时）、空 url 守卫。
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHttp, HttpError } from '../../src/http'
import type { HttpRequestInit, HttpResponse } from '../../src/types/http'

/** 打桩 fetch 时收到的 init（与实现传给 fetch 的形状一致） */
interface FetchInitArg {
  method?: string
  headers?: Record<string, string>
  body?: string
  signal?: AbortSignal
}

type FetchImpl = (url: string, init?: FetchInitArg) => Promise<Response>

/** 构造原生 Response（默认 JSON 内容类型） */
function jsonResponse(body: unknown, init: { status?: number; contentType?: string } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'content-type': init.contentType ?? 'application/json' },
  })
}

/** fetch 被中止时的原生错误形态（DOMException name 为 AbortError；Node 18+ undici 同形） */
function abortError(message = 'The operation was aborted'): Error {
  const error = new Error(message)
  error.name = 'AbortError'
  return error
}

/** fake timers 下的最小 Response 替身（绕开 undici body 读取的真实定时器依赖） */
function fakeResponse(init: { status?: number; body?: unknown } = {}): Response {
  return {
    ok: (init.status ?? 200) >= 200 && (init.status ?? 200) < 300,
    status: init.status ?? 200,
    statusText: '',
    headers: [['content-type', 'application/json']] as Iterable<readonly [string, string]>,
    json: () => Promise.resolve(init.body ?? {}),
  } as unknown as Response
}

let fetchMock: ReturnType<typeof vi.fn<FetchImpl>>

beforeEach(() => {
  fetchMock = vi.fn<FetchImpl>((): Promise<Response> => Promise.resolve(jsonResponse({ code: 0 })))
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createHttp', () => {
  it('get：拼接 baseURL 与查询参数，GET 无请求体，返回反序列化数据', async () => {
    fetchMock.mockImplementationOnce(() => Promise.resolve(jsonResponse({ code: 0, list: [1, 2] })))
    const http = createHttp({ baseURL: 'https://api.test' })
    const data = await http.get<{ code: number; list: number[] }>('/users', { id: '1' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.test/users?id=1')
    const init = fetchMock.mock.calls[0]?.[1] as FetchInitArg
    expect(init.method).toBe('GET')
    expect(init.body).toBeUndefined()
    expect(data).toEqual({ code: 0, list: [1, 2] })
  })

  it('请求头三层合并：setup 默认槽 < 实例级 < 请求级', async () => {
    const http = createHttp({ headers: { Authorization: 'token' } })
    await http.get('/ping', undefined, { headers: { 'X-Req': '1' } })
    const headers = (fetchMock.mock.calls[0]?.[1] as FetchInitArg).headers ?? {}
    // setup 默认槽（application/x-www-form-urlencoded）与实例级、请求级并存
    expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded; charset=UTF-8')
    expect(headers.Authorization).toBe('token')
    expect(headers['X-Req']).toBe('1')
  })

  it('post：对象体 JSON 序列化并自动置 JSON 头', async () => {
    const http = createHttp()
    await http.post('/users', { name: 'a' })
    const init = fetchMock.mock.calls[0]?.[1] as FetchInitArg
    expect(init.method).toBe('POST')
    expect(init.body).toBe('{"name":"a"}')
    expect(init.headers?.['Content-Type']).toBe('application/json; charset=UTF-8')
  })

  it('post：调用方显式指定的 Content-Type 优先于自动 JSON 头', async () => {
    const http = createHttp()
    await http.post('/users', { name: 'a' }, { headers: { 'Content-Type': 'text/plain' } })
    const init = fetchMock.mock.calls[0]?.[1] as FetchInitArg
    expect(init.body).toBe('{"name":"a"}')
    expect(init.headers?.['Content-Type']).toBe('text/plain')
  })

  it('put / delete：方法与查询参数、请求体形态', async () => {
    const http = createHttp({ baseURL: 'https://api.test' })
    await http.put('/users/1', { age: 2 })
    await http.delete('/users', { id: '9' })
    const putCall = fetchMock.mock.calls[0]
    const deleteCall = fetchMock.mock.calls[1]
    expect(putCall?.[0]).toBe('https://api.test/users/1')
    expect((putCall?.[1] as FetchInitArg).method).toBe('PUT')
    expect((putCall?.[1] as FetchInitArg).body).toBe('{"age":2}')
    expect((putCall?.[1] as FetchInitArg).headers?.['Content-Type']).toBe('application/json; charset=UTF-8')
    expect(deleteCall?.[0]).toBe('https://api.test/users?id=9')
    expect((deleteCall?.[1] as FetchInitArg).method).toBe('DELETE')
    expect((deleteCall?.[1] as FetchInitArg).body).toBeUndefined()
  })

  it('非 JSON 响应：返回原始文本', async () => {
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve(new Response('plain text', { headers: { 'content-type': 'text/plain' } })),
    )
    const http = createHttp()
    const data = await http.get<string>('/txt')
    expect(data).toBe('plain text')
  })

  it('beforeRequest 钩子：返回新 init 替换最终请求', async () => {
    const seen: HttpRequestInit[] = []
    const http = createHttp({
      baseURL: 'https://api.test',
      beforeRequest: (request) => {
        seen.push(request)
        return { ...request, url: `${request.url}&hooked=1`, headers: { ...request.headers, 'X-Hook': '1' } }
      },
    })
    await http.get('/users', { id: '1' })
    // 钩子收到拼接后的完整请求，替换后 fetch 拿到改写版
    expect(seen[0]?.url).toBe('https://api.test/users?id=1')
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.test/users?id=1&hooked=1')
    expect((fetchMock.mock.calls[0]?.[1] as FetchInitArg).headers?.['X-Hook']).toBe('1')
  })

  it('afterResponse 钩子：收到含反序列化数据的最小响应投影', async () => {
    fetchMock.mockImplementationOnce(() => Promise.resolve(jsonResponse({ code: 3 })))
    const responses: HttpResponse<unknown>[] = []
    const http = createHttp({
      afterResponse: (response) => {
        responses.push(response)
      },
    })
    await http.get('/data')
    expect(responses).toHaveLength(1)
    expect(responses[0]?.ok).toBe(true)
    expect(responses[0]?.status).toBe(200)
    expect(responses[0]?.headers['content-type']).toBe('application/json')
    expect(responses[0]?.data).toEqual({ code: 3 })
  })

  it('非 2xx：reject 请求失败（afterResponse 仍收到完整响应）', async () => {
    fetchMock.mockImplementationOnce(() => Promise.resolve(jsonResponse({ msg: 'nope' }, { status: 404 })))
    const responses: HttpResponse<unknown>[] = []
    const http = createHttp({
      afterResponse: (response) => {
        responses.push(response)
      },
    })
    await expect(http.get('/missing')).rejects.toThrow('[spark-utils][http]: 请求失败（404）')
    expect(responses[0]?.ok).toBe(false)
    expect(responses[0]?.status).toBe(404)
  })

  it('超时：AbortController 中止挂起请求并 reject 超时错误', async () => {
    vi.useFakeTimers()
    try {
      const hanging: FetchImpl = (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(abortError()))
        })
      vi.stubGlobal('fetch', hanging)
      const http = createHttp({ timeout: 100 })
      const pending = http.get('/slow')
      const assertion = expect(pending).rejects.toThrow('[spark-utils][http]: 请求超时（100ms）')
      vi.advanceTimersByTime(100)
      await assertion
    } finally {
      vi.useRealTimers()
    }
  })

  it('HttpError：非 2xx 与超时抛类型化错误（kind/status/url/timeout 字段）', async () => {
    fetchMock.mockImplementationOnce(() => Promise.resolve(jsonResponse({ msg: 'nope' }, { status: 500 })))
    const http = createHttp({ baseURL: 'https://api.test' })
    const failure = await http.get('/boom').catch((error: unknown) => error)
    expect(failure).toBeInstanceOf(HttpError)
    expect(failure).toBeInstanceOf(Error)
    const httpErr = failure as HttpError
    expect(httpErr.kind).toBe('http')
    expect(httpErr.status).toBe(500)
    expect(httpErr.url).toBe('https://api.test/boom')
    expect(httpErr.timeout).toBeUndefined()

    vi.useFakeTimers()
    try {
      const hanging: FetchImpl = (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(abortError()))
        })
      vi.stubGlobal('fetch', hanging)
      const slowHttp = createHttp({ timeout: 80 })
      const pending = slowHttp.get('https://api.test/slow')
      const caught = pending.catch((error: unknown) => error)
      vi.advanceTimersByTime(80)
      const timeoutErr = (await caught) as HttpError
      expect(timeoutErr).toBeInstanceOf(HttpError)
      expect(timeoutErr.kind).toBe('timeout')
      expect(timeoutErr.timeout).toBe(80)
      expect(timeoutErr.url).toBe('https://api.test/slow')
      expect(timeoutErr.status).toBeUndefined()
      expect(timeoutErr.name).toBe('HttpError')
    } finally {
      vi.useRealTimers()
    }
  })

  it('外部 signal 预先中止：fetch 收到已中止信号，原始错误透传', async () => {
    const external = new AbortController()
    external.abort()
    fetchMock.mockImplementationOnce((_url, init) =>
      init?.signal?.aborted ? Promise.reject(new Error('外部信号已中止')) : Promise.resolve(jsonResponse({})),
    )
    const http = createHttp()
    await expect(http.get('/x', undefined, { signal: external.signal })).rejects.toThrow('外部信号已中止')
  })

  it('外部 signal 中途中止：原生 AbortError 透传，不误报为超时', async () => {
    const external = new AbortController()
    const hanging: FetchImpl = (_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(abortError()))
      })
    vi.stubGlobal('fetch', hanging)
    const http = createHttp({ timeout: 5000 })
    const caught = http.get('/x', undefined, { signal: external.signal }).catch((error: unknown) => error)
    await Promise.resolve()
    external.abort()
    const error = (await caught) as Error
    expect(error.name).toBe('AbortError')
    expect(error).not.toBeInstanceOf(HttpError)
  })

  it('计时器与 4xx 竞态：超时触发后非 2xx 错误仍按 HttpError(http) 透传（不误报超时、不吞状态码）', async () => {
    // 真实定时器拉开时序：30ms 超时先置位 timedOut（响应已在手，中止无效），
    // 50ms 钩子完成后才抛 4xx——错误必须仍是 HttpError('http') 而非超时
    fetchMock.mockImplementationOnce(() => Promise.resolve(fakeResponse({ status: 404, body: { msg: 'nope' } })))
    const http = createHttp({
      timeout: 30,
      afterResponse: () => new Promise<void>((resolve) => setTimeout(resolve, 50)),
    })
    const failure = (await http.get('/missing').catch((error: unknown) => error)) as HttpError
    expect(failure).toBeInstanceOf(HttpError)
    expect(failure.kind).toBe('http')
    expect(failure.status).toBe(404)
  })

  it('afterResponse 抛错：即便与超时计时器竞态也原样透传（不误报超时）', async () => {
    // 同上时序：30ms 超时已置位 timedOut，50ms 钩子抛错原样透传
    fetchMock.mockImplementationOnce(() => Promise.resolve(fakeResponse({ status: 200, body: { ok: 1 } })))
    const http = createHttp({
      timeout: 30,
      afterResponse: () => new Promise((_resolve, reject) => setTimeout(() => reject(new Error('hook boom')), 50)),
    })
    const failure = (await http.get('/data').catch((error: unknown) => error)) as Error
    expect(failure.message).toBe('hook boom')
    expect(failure).not.toBeInstanceOf(HttpError)
  })

  it('字符串体：原样发送，未显式指定 Content-Type 时剥离内置默认表单头', async () => {
    const http = createHttp()
    await http.post('/xml', '<a>1</a>')
    const init = fetchMock.mock.calls[0]?.[1] as FetchInitArg
    expect(init.body).toBe('<a>1</a>')
    // 交由 fetch 原生默认（text/plain;charset=UTF-8），不携带继承的表单头
    expect(Object.keys(init.headers ?? {}).some((key) => key.toLowerCase() === 'content-type')).toBe(false)
  })

  it('字符串体：实例级/请求级显式 Content-Type 优先，不被剥离', async () => {
    const withHeaders = createHttp({ headers: { 'Content-Type': 'text/xml' } })
    await withHeaders.post('/xml', '<a/>')
    expect((fetchMock.mock.calls[0]?.[1] as FetchInitArg).headers?.['Content-Type']).toBe('text/xml')

    const http = createHttp()
    await http.post('/xml', '<a/>', { headers: { 'content-type': 'text/xml' } })
    expect((fetchMock.mock.calls[1]?.[1] as FetchInitArg).headers?.['content-type']).toBe('text/xml')
  })

  it('空 url 守卫：便捷方法发出前 reject（与 submit 对齐）', async () => {
    const http = createHttp()
    await expect(http.get('')).rejects.toThrow('[spark-utils][http]: 请传入url参数!')
    await expect(http.post('', { a: 1 })).rejects.toThrow('[spark-utils][http]: 请传入url参数!')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('beforeRequest 钩子：返回部分字段与当前 init 浅合并（未覆盖字段沿用）', async () => {
    const http = createHttp({
      baseURL: 'https://api.test',
      beforeRequest: () => ({ headers: { 'X-Only': '1' } }),
    })
    await http.get('/users')
    const init = fetchMock.mock.calls[0]?.[1] as FetchInitArg
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.test/users')
    expect(init.method).toBe('GET')
    expect(init.headers?.['X-Only']).toBe('1')
  })

  it('submit：默认 POST + 对象体；method/params 透传；缺 url reject', async () => {
    const http = createHttp({ baseURL: 'https://api.test' })
    await http.submit({ url: '/login', data: { user: 'u' } })
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.test/login')
    expect((fetchMock.mock.calls[0]?.[1] as FetchInitArg).method).toBe('POST')
    expect((fetchMock.mock.calls[0]?.[1] as FetchInitArg).body).toBe('{"user":"u"}')

    await http.submit({ url: '/list', method: 'GET', params: { page: '2' } })
    expect(fetchMock.mock.calls[1]?.[0]).toBe('https://api.test/list?page=2')
    expect((fetchMock.mock.calls[1]?.[1] as FetchInitArg).method).toBe('GET')
    expect((fetchMock.mock.calls[1]?.[1] as FetchInitArg).body).toBeUndefined()

    // url 为必填类型，空串走运行时守卫（旧 submit 的 !url 校验同语义）
    await expect(http.submit({ url: '' })).rejects.toThrow('[spark-utils][http][submit]: 请传入url参数!')
  })
})
