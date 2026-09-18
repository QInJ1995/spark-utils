# 浏览器工具

浏览器专属能力收敛在 `spark-utils/browser` 子入口（28 个具名导出），按 cookie / storage / dom / ua / url / crossDomain / clipboard 分组：

```ts
import { copyText, parseUrl, isChrome, setupCrossDomain } from 'spark-utils/browser'
```

::: tip 同构安全
所有 `window` / `document` / `location` / `navigator` 访问均为惰性求值：Node 下 import 本入口零副作用、不抛错；方法调用时返回空值或 `false`。
:::

::: tip 2.0 变更
- IE 系 7 方法（`isIE` / `isIE9` / `isIE10` / `isIE11` / `IEVersion` / `notSupported` 等）已删除；
- `clientBrowser` / `clientSystem` / `clientScreenSize` 由加载期求值的常量改为**惰性函数**，调用时才读取环境；
- `copyText` 改为异步方法；
- `crossDomain` 重设计为 `setupCrossDomain`（详见下文）。
:::

## 环境与 UA

### browse

获取浏览器内核与能力信息。

`browse(): BrowseInfo`

```ts
import { browse } from 'spark-utils/browser'

const env = browse()
env.isMobile    // 是否移动端
env.isPC        // 是否 PC 端
env.isNode      // 是否 Node 环境
env.isLocalStorage  // localStorage 是否可用
```

### getBrowserInfo / clientBrowser

`getBrowserInfo()` 返回 `{ browser, version }`（firefox / edge / chrome / safari / opera / UNKNOWN）；`clientBrowser()` 直接返回浏览器名。

```ts
import { getBrowserInfo, clientBrowser } from 'spark-utils/browser'

getBrowserInfo()  // { browser: 'chrome', version: '122' }
clientBrowser()   // 'chrome'
```

### clientSystem / clientScreenSize

当前操作系统名（win / mac / ios / android / …）与屏幕尺寸 `'宽,高'`。2.0 起为函数调用。

```ts
import { clientSystem, clientScreenSize } from 'spark-utils/browser'

clientSystem()     // 'mac'
clientScreenSize() // '1920,1080'
```

### isChrome / isFireFox / isSafari

```ts
import { isChrome, isFireFox, isSafari } from 'spark-utils/browser'

isChrome()   // true
isFireFox()  // false
isSafari()   // false
```

## URL 处理

### parseUrl

解析 URL（协议相对 / 根相对路径会补全当前 origin）。

`parseUrl(url: string): ParsedUrl`

```ts
import { parseUrl } from 'spark-utils/browser'

const info = parseUrl('https://a.com/path/page?x=1#hash?q=2')
info.host         // 'a.com'
info.pathname     // '/path/page'
info.searchQuery  // { x: '1' }
info.hashQuery    // { q: '2' }
```

### locat / getBaseURL / getNowPageParam

- `locat()`：当前地址栏信息（同 `parseUrl` 的返回结构；非浏览器返回空对象）；
- `getBaseURL()`：当前站点基础路径（origin + 到最后一个 `/` 的路径）；
- `getNowPageParam(s?)`：当前地址（或指定串）的全部查询参数。

```ts
import { locat, getBaseURL, getNowPageParam } from 'spark-utils/browser'

locat().origin      // 'https://a.com'
getBaseURL()        // 'https://a.com/path/'
getNowPageParam()   // { x: '1' }
```

### serialize / unserialize / objectToUrlParam

查询参数对象 ↔ 查询串互转（`objectToUrlParam` 为 `serialize` 别名；嵌套值以 `key[i]` 括号展开）。

```ts
import { serialize, unserialize } from 'spark-utils/browser'

serialize({ a: 1, b: [2, 3] })   // 'a=1&b[0]=2&b[1]=3'
unserialize('a=1&b=2')           // { a: '1', b: '2' }
```

## 跨文档通讯（crossDomain）

::: tip 2.0 安全重设计
1.x 在模块加载时即向 `window` 挂载全局并注册监听，且以 `eval` 执行消息携带的任意函数名——等于向任何来源开放任意代码执行。2.0 改为：

- 显式调用 `setupCrossDomain(options)` 后才建立监听；
- 移除 `eval`：仅执行 `allowCalls` 白名单中注册过的函数；
- 增加 `event.origin` 来源白名单校验（`allowOrigins` 精确匹配，不支持通配符）；
- 不再向 window 挂载全局变量；消息协议字段（`crossDomain` / `call` / `callFun` / `arg` / `callBackFun`）保持不变。
:::

```ts
import { setupCrossDomain, sendMessage } from 'spark-utils/browser'

// 宿主页：注册来源与可被调用方法
const handle = setupCrossDomain({
  allowOrigins: ['https://child.example.com'],
  allowCalls: {
    getUser: (arg: unknown) => ({ id: 1, name: 'spark' }),
  },
  targetOrigin: 'https://child.example.com',
})

// 向 iframe 发起调用（目标为 iframe id / window 对象 / null 顶层窗口）
sendMessage('myIframe', 'refresh', { force: true }, 'onRefreshed')

// 注销监听（幂等）
handle.destroy()
```

## 剪贴板

### copyText

复制文本到剪贴板。优先走异步 Clipboard API，失败回退隐藏 textarea + `execCommand('copy')`。

::: tip 2.0 变更
返回值由同步 `boolean` 改为 `Promise<boolean>`；非浏览器环境返回 `false`。
:::

```ts
import { copyText } from 'spark-utils/browser'

const ok = await copyText('要复制的文本')
```

## 相关页面

- [Cookie](./cookie)：`cookie` / `setCookie` / `getCookie` / `getToken`
- [WebStorage](./storage)：`createWebStorage` / `getStorage` / `webStorage`
- [DOM](./dom)：`getStyle` / `getWidth` / `getHeight`
