/**
 * http 模块测试（M5：createHttp 行为锁定，node 环境）
 *
 * fetch 经 vi.stubGlobal 打桩（原生 Response 构造响应），覆盖：
 * get/post/put/delete/submit 五个便捷方法、baseURL 与查询参数拼接、三层请求头合并
 * （请求级 > 实例级 > setup 默认槽）、对象体的 JSON 序列化与自动 JSON 头（显式头优先）、
 * 文本响应透传、beforeRequest/afterResponse 钩子、非 2xx 抛错、
 * AbortController 超时中止（vi.useFakeTimers）与外部 signal 联动。
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHttp } from '../../src/http'
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
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')))
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

  it('外部 signal 预先中止：fetch 收到已中止信号，原始错误透传', async () => {
    const external = new AbortController()
    external.abort()
    fetchMock.mockImplementationOnce((_url, init) =>
      init?.signal?.aborted ? Promise.reject(new Error('外部信号已中止')) : Promise.resolve(jsonResponse({})),
    )
    const http = createHttp()
    await expect(http.get('/x', undefined, { signal: external.signal })).rejects.toThrow('外部信号已中止')
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
