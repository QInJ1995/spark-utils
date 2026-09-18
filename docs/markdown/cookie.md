# Cookie

cookie 读写，从 `spark-utils/browser` 子入口导入。

::: tip 2.0 变更
旧 `src/cookie` 的独立实现（`setCookie` / `getCookie` / `getToken`）与 xe-utils 风格的 `cookie` 主函数合并为一套：`setCookie` / `getCookie` / `getToken` 现为同一实现的兼容别名。`expires` 为 NaN（含 Invalid Date）时不再抛 `TypeError`，静默按原值写入。
:::

## cookie

主函数，调用形态分派读 / 写：

- `cookie()` → 读取全部（`Record`）
- `cookie('name')` → 读取单个（`string | undefined`）
- `cookie('name', value, options?)` / `cookie({ ... })` / `cookie([{ ... }, ...])` → 写入，返回 `true`

携带静态方法族：`has` / `set` / `setItem` / `get` / `getItem` / `remove` / `removeItem` / `keys` / `getJSON`。

```ts
import { cookie } from 'spark-utils/browser'

cookie('token', 'abc123', { expires: '30d', path: '/' })  // 写入，30 天过期
cookie('token')            // 'abc123'
cookie.has('token')        // true
cookie()                   // { token: 'abc123' }
cookie.remove('token')     // 删除
```

写入项 `CookieItem`：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 键名（必填） |
| `value` | `unknown` | 值；对象 / null 自动 JSON 序列化 |
| `expires` | `string \| number \| Date` | 天数 / 毫秒时间戳 / Date / `'30d'` 单位串（y M d H h m s） |
| `path` | `string` | 路径 |
| `domain` | `string` | 作用域 |
| `secure` | `boolean` | 仅 https 传输 |

## setCookie

兼容别名：以**秒**为过期单位写入。

`setCookie(name, value, seconds?, path?)`

```ts
import { setCookie } from 'spark-utils/browser'

setCookie('token', 'abc', 60 * 30, '/')  // 30 分钟后过期
```

## getCookie

兼容别名：读取单个 cookie，未命中返回 `null`。

```ts
import { getCookie } from 'spark-utils/browser'

getCookie('token')  // 'abc'（未命中为 null）
```

## getToken

读取 CSRF 令牌，默认键名 `XSRF-TOKEN`（精确键名匹配，未命中返回空串）。

`getToken(name?)`

```ts
import { getToken } from 'spark-utils/browser'

getToken()               // 读 XSRF-TOKEN
getToken('CSRF-TOKEN')   // 读指定键
```
