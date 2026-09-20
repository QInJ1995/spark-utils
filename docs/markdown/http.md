# 网络请求

基于原生 `fetch` 的请求封装，Node 18+ 与浏览器同构。

::: tip 2.0 变更
1.x 的 `https.init` / `https.axios` / `https.submit`（axios 封装）已整体替换为 `createHttp`：

- `https.init(options)` 创建全局单例 → `createHttp(config)` 返回独立实例，可创建多个互不影响；
- 拦截器 `interceptors.request` / `interceptors.response` → 钩子 `beforeRequest` / `afterResponse`；
- 旧响应拦截器「默认返回 `responseRes.data`」的行为内建：便捷方法直接返回反序列化数据；
- `submit` 的 `autoQs` 开关删除：对象请求体统一 JSON 序列化，未显式指定 Content-Type 时自动置 `application/json; charset=UTF-8`；字符串请求体原样发送，未显式指定 Content-Type 时剥掉继承的默认表单头（由 fetch 原生置 `text/plain`），与对象体的自动 JSON 头对称；
- `https.axios` 透出的 axios 实例不再提供（需要 axios 请自行引入）。
:::

## createHttp

创建请求实例。

```ts
import { createHttp } from 'spark-utils'

const http = createHttp({
  baseURL: 'https://api.example.com',
  timeout: 10000,                          // 0 表示不超时
  headers: { Authorization: 'Bearer token' },
})
```

| 配置 | 类型 | 说明 |
| --- | --- | --- |
| `baseURL` | `string` | 基础地址，拼接在相对 url 前（绝对地址不拼接） |
| `timeout` | `number` | 超时毫秒数（0 不超时），默认取全局配置的 10000 |
| `headers` | `Record<string, string>` | 实例级默认请求头 |
| `beforeRequest` | `(req) => HttpRequestInit \| void \| Promise<...>` | 请求前钩子，返回新 init 可替换最终请求 |
| `afterResponse` | `(res: HttpResponse) => void \| Promise<void>` | 响应后钩子（含 4xx/5xx） |

## 便捷方法

`get` / `delete` 第二参为查询参数；`post` / `put` 第二参为请求体；均直接返回反序列化后的响应体（`Promise<T>`）。

```ts
import { createHttp } from 'spark-utils'

interface User { id: number; name: string }

const http = createHttp({ baseURL: 'https://api.example.com' })

// GET（第二参为查询参数）
const list = await http.get<User[]>('/users', { page: '1' })

// POST（对象自动 JSON 序列化并置 JSON 头）
const created = await http.post<User>('/users', { name: 'spark' })

// PUT / DELETE
await http.put<User>('/users/1', { name: 'utils' })
await http.delete('/users/1', { force: 'true' })
```

请求级配置（第三参）可覆盖实例级：`params` / `headers` / `timeout` / `signal`（外部取消与超时联动）。

```ts
const controller = new AbortController()
http.get('/slow', undefined, { timeout: 3000, signal: controller.signal })
```

## submit

统一提交入口（默认 POST），对应旧 `https.submit`。

```ts
import { createHttp } from 'spark-utils'

const http = createHttp()

await http.submit({
  url: '/login',
  method: 'POST',
  data: { user: 'spark', pass: '***' },
  headers: { 'X-From': 'h5' },
})
```

## 拦截钩子

```ts
import { createHttp } from 'spark-utils'

const http = createHttp({
  beforeRequest(init) {
    // 统一追加令牌；返回对象则与当前 init 浅合并（部分字段即可，完整对象等价整体替换）
    init.headers.Authorization = 'Bearer token'
  },
  afterResponse(res) {
    // 每个完整响应（含 4xx/5xx）都会经过这里；钩子抛出的错误原样透传
    console.log(res.status, res.ok)
  },
})
```

## 错误处理

- url 为空的请求在发出前 reject（`submit` 沿用旧版专用文案，便捷方法为 `[spark-utils][http]: 请传入url参数!`）；
- 非 2xx 响应与超时抛类型化 `HttpError`（主入口具名导出），可按 `kind` / `status` / `url` / `timeout` 编程区分：
  - 非 2xx：`kind: 'http'`，`e.status` 为响应状态码，message 为 `[spark-utils][http]: 请求失败（状态码）url`；
  - 超时（`AbortController` 中止）：`kind: 'timeout'`，`e.timeout` 为设定的毫秒数，message 为 `请求超时（n ms）url`；
- 超时判定收紧：仅当错误确为本实例超时中止的 `AbortError` 才报超时；`afterResponse` 抛错、非 2xx 错误、响应体解析失败即便与计时器竞态同时发生，也按原样透传（不误报超时、不吞状态码）；
- 外部 `signal` 主动取消与网络错误仍抛原生错误（与超时的 `HttpError` 有意区分）；
- 响应体按 `content-type` 自动反序列化：含 `json` 时 `response.json()`，否则 `response.text()`。

```ts
import { createHttp, HttpError } from 'spark-utils'

try {
  const http = createHttp({ timeout: 5000 })
  await http.get('/api/user')
} catch (e) {
  if (e instanceof HttpError && e.kind === 'timeout') {
    console.log(`请求 ${e.url} 超时（${e.timeout}ms）`)
  } else if (e instanceof HttpError) {
    console.log(`请求失败（${e.status}）：${e.url}`)
  }
}
```
