# 快速上手

## 前置准备

- 本地安装 [Node.js](https://nodejs.org/) **18 及以上版本**（2.0 起 `engines.node >= 18`）

## 安装

::: code-group

```sh [npm]
$ npm install spark-utils
```

```sh [pnpm]
$ pnpm add spark-utils
```

```sh [yarn]
$ yarn add spark-utils
```

:::

## 子入口矩阵

2.0 按运行环境与体积特征拆分入口，按需从对应入口导入：

| 入口 | 内容 | 体积特征 | Node 下 import |
| --- | --- | --- | --- |
| `spark-utils` | 主包：类型判定 / 数组 / 对象 / 函数 / 日期 / 数值 / 字符串 / http / other（169 个具名导出） | 轻量（minify+gzip 约 16KB 不含 dayjs）；dayjs 为 external 依赖；无浏览器全局触碰 | 安全（推荐） |
| `spark-utils/browser` | 浏览器专属 28 个方法：cookie / storage / dom / ua / url / crossDomain / clipboard | 轻量；懒求值，Node 下 import 零副作用 | 安全（调用返回空值/false） |
| `spark-utils/crypto` | 10 个加解密方法：AES / MD5 / RSA 签名验签 / SM 系列 / create64Key | 较重（crypto-js + jsrsasign 仅此入口可达） | 可用 |
| `spark-utils/pinyin` | `pinyin` 对象（getFullChars / getCamelChars） | 拼音字典独立分包，不拖累主包 | 可用 |
| `spark-utils/umd` | `dist/spark-utils.min.js`（UMD 产物） | 单文件，dayjs 已打入，供 `<script>` 直引 | - |

## 基本使用

全部为**具名导出**（2.0 起不再以命名空间对象为主要用法）：

```ts
import { debounce, isEqual, dateDiff, moneyFormat } from 'spark-utils'

// 类型提示直接可用：unit 为 's' | 'n' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'
const days = dateDiff('2024-01-01', '2024-02-01', { unit: 'd' })

moneyFormat(1234567.891, 2) // '1,234,567.89'
isEqual({ a: 1 }, { a: 1 }) // true
```

浏览器能力从子入口导入：

```ts
import { copyText, getCookie, parseUrl } from 'spark-utils/browser'

// 2.0 起 copyText 为异步方法
const ok = await copyText('你好，spark-utils')
```

加密方法从 crypto 子入口导入（错误统一抛 `CryptoError`，不再静默返回 false）：

```ts
import { aesEncrypt, aesDecrypt } from 'spark-utils/crypto'

const cipher = aesEncrypt('你好，坤坤', 'abcdefghijkl', 'opqrstuvwxyz')
aesDecrypt(cipher, 'abcdefghijkl', 'opqrstuvwxyz') // '你好，坤坤'
```

### CommonJS（require）

每个入口都有 CJS 产物（`dist/*.cjs`），CommonJS 项目直接 `require`：

```js
const { debounce, moneyFormat } = require('spark-utils')
const { getCookie } = require('spark-utils/browser')
const { md5Sign } = require('spark-utils/crypto')
```

### TypeScript 类型导入

2.0 的类型随包发布（无需额外 `@types`），公共类型可按需 `import type`：

```ts
import type { SparkUtilsSetup } from 'spark-utils'
// http 域类型同样从主入口可达
import type { HttpConfig, HttpRequestConfig, HttpResponse } from 'spark-utils'
// 子入口类型从对应入口导入
import type { CookieOptions } from 'spark-utils/browser'
import type { CryptoErrorCode } from 'spark-utils/crypto'

// 举例：封装公司统一的请求实例配置
const config: HttpConfig = {
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { Authorization: 'Bearer token' },
}
```

## 全局配置

`setup` 具名导出，浅合并生成**深度冻结**的新配置并即时生效（1.x 的可变单例已移除；旧 `axiosConfig` 键更名 `httpConfig`）：

```ts
import { setup, setupDefaults } from 'spark-utils'

setup({ treeOptions: { parentKey: 'pid', key: 'id', children: 'nodes' } })

setupDefaults // 默认配置（只读）
```

全部配置项一览（类型 `SparkUtilsSetup`）：

| 配置项 | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `showLog` | `boolean` | `true` | browser 子入口 webStorage 写入日志开关 |
| `httpConfig.baseURL` | `string` | `''` | `createHttp` 默认请求地址前缀 |
| `httpConfig.timeout` | `number` | `10000` | `createHttp` 默认超时（毫秒） |
| `httpConfig.headers` | `Record<string, string>` | `{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }` | `createHttp` 默认请求头（对象体自动覆盖为 JSON 头） |
| `promiseResultConfig.resultKey` | `string` | `'data'` | `promiseResultHandle` 默认取值键 |
| `promiseResultConfig.verifyConfig` | `Record<string, unknown>` | `{}` | `promiseResultHandle` 默认校验配置 |
| `treeOptions.parentKey` | `string` | `'parentId'` | 树形方法（toArrayTree 等）父键名 |
| `treeOptions.key` | `string` | `'id'` | 树形方法节点键名 |
| `treeOptions.children` | `string` | `'children'` | 树形方法子级键名 |
| `formatDate` | `string` | `'yyyy-MM-dd HH:mm:ss.SSSZ'` | `toStringDate` 缺省解析格式 |
| `formatString` | `string` | `'yyyy-MM-dd HH:mm:ss'` | `toDateString` 缺省输出格式 |
| `dateDiffRules` | `[string, number][]` | `[['yyyy', 31536000000], ['MM', 2592000000], ['dd', 86400000], ['HH', 3600000], ['mm', 60000], ['ss', 1000], ['S', 0]]` | `dateDiff` 明细模式默认换算规则 |
| `cookies.path` | `string` | - | cookie 写入默认路径（browser 子入口） |
| `cookies.domain` | `string` | - | cookie 写入默认作用域 |
| `cookies.secure` | `boolean` | - | cookie 写入默认是否仅 https 传输 |
| `cookies.expires` | `string \| number \| Date` | - | cookie 写入默认过期（支持 `'30d'` 单位串） |

注意：嵌套对象整体替换（不做深合并）且传入后会被冻结，请每次传入全新对象；`setup()` 返回合并后的当前配置，可用于确认生效结果：

```ts
const current = setup({ httpConfig: { baseURL: 'https://api.example.com', timeout: 5000, headers: {} } })
current.httpConfig.baseURL // 'https://api.example.com'
```

## 常见场景示例

以下示例均经仓库测试链实际运行验证（输出值真实）。

### 搜索框防抖（leading 立即触发一次）

```ts
import { debounce } from 'spark-utils'

const search = debounce(
  (keyword: string) => api.search(keyword),
  300,
  { leading: true, trailing: false }, // 首次调用立即执行，后续调用在静默期内被吞
)

search('sp')
search('spark') // leading 模式下不再触发（间隔内），要 trailing 补一次可两个都开
```

### 后端平铺列表转树 + 遍历/改造

```ts
import { toArrayTree, eachTree, mapTree } from 'spark-utils'

const flat = [
  { id: 1, pid: null, name: '总部' },
  { id: 2, pid: 1, name: '研发部' },
  { id: 3, pid: 1, name: '产品部' },
  { id: 4, pid: 2, name: '前端组' },
]

// 后端用 pid 作父键时无须逐处传参，配一次 setup 即全局生效
import { setup } from 'spark-utils'
setup({ treeOptions: { parentKey: 'pid', key: 'id', children: 'children' } })

const tree = toArrayTree(flat) // 根层 ['总部']

eachTree(tree, (item, index, items, path, parent, nodes) => {
  // item/nodes 等参数已按节点类型推断（泛型）；深度优先顺序：总部 → 研发部 → 前端组 → 产品部
})

// mapTree 回调须返回对象（实现要在返回值上挂 children）
const mapped = mapTree(tree, (item) => ({ label: item.name, isLeaf: true }))
```

### 金额格式化（千分位 / 人民币大写）

```ts
import { moneyFormat, cnMoneyFormat } from 'spark-utils'

moneyFormat(1234567.891, 2)          // '1,234,567.89'
moneyFormat(-9876.5, 2, '￥')        // '￥-9,876.50'
cnMoneyFormat(1234567.89)            // '壹佰贰拾叁万肆仟伍佰陆拾柒元捌角玖分'
```

### 嵌套结构深比较

```ts
import { isEqual } from 'spark-utils'

isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })  // true
```

### 两个日期的差值（单位 / 明细两种口径）

```ts
import { dateDiff } from 'spark-utils'

dateDiff('2024-01-01', '2024-02-01', { unit: 'M' })
// 1（自然月差）

dateDiff('2024-01-01', '2024-03-10 12:30:00', { detailed: true })
// { done: true, time: 6006600000, yyyy: 0, MM: 2, dd: 9, HH: 12, mm: 30, ss: 0, S: 0 }
```

### 统一请求实例（createHttp + 全局 baseURL）

```ts
import { createHttp, setup } from 'spark-utils'

setup({
  httpConfig: {
    baseURL: 'https://api.example.com',
    timeout: 5000,
    headers: { Authorization: 'Bearer token' },
  },
})

const http = createHttp() // 不传参则继承全局 httpConfig

interface User { id: number; name: string }

// 便捷方法直接返回反序列化后的响应体（Promise<T>）；非 2xx 抛 HttpError
const user = await http.get<User>('/users/1')
user.name
```

### URL 解析与本地存储（浏览器子入口）

```ts
import { parseUrl, createWebStorage } from 'spark-utils/browser'

parseUrl('https://a.com:8080/p?q=1#frag')
// { href, hash, host, hostname, protocol, port, search, path, pathname, origin,
//   hashKey, hashQuery, searchQuery: { q: '1' } }

const store = createWebStorage('my-app', { isLocal: true, invalidTime: 3600 })
if (store !== false) {
  store.set('user', { id: 1 })  // 1 小时后过期
  store.get('user')             // { id: 1 }
}
```

## 同构说明

- 主包在 Node 中可直接 `import`：`isWindow` 等浏览器判定返回 `false`（旧版返回 `0`）。
- `spark-utils/browser` 的所有浏览器全局访问均为惰性求值：Node 下 import 不抛错，调用时返回空值或 `false`。
- `createHttp` 基于原生 `fetch`，Node 18+ 与浏览器行为一致。

## UMD（script 直引）

`dist/spark-utils.min.js` 保留 UMD 产物（dayjs 已打入，crypto-js / jsrsasign 不在其中——UMD 不含 crypto 子入口）：

```html
<script src="node_modules/spark-utils/dist/spark-utils.min.js"></script>
<script>
  const { debounce, moneyFormat } = SparkUtils
</script>
```

也可经 CDN 引用（替换 `spark-utils` 为 `spark-utils@2.0.0` 可锁定版本）：

```html
<script src="https://unpkg.com/spark-utils/dist/spark-utils.min.js"></script>
<!-- 或 -->
<script src="https://cdn.jsdelivr.net/npm/spark-utils/dist/spark-utils.min.js"></script>
```

## tree-shaking

包声明了 `sideEffects: false` 且各入口均为具名导出（ESM），只引入用到的函数即可被打包器有效摇树：

```ts
// 打包产物只包含 debounce 相关代码
import { debounce } from 'spark-utils'
```

注意：`import SparkUtils from 'spark-utils'`（default 聚合对象）会阻断摇树，仅建议在 UMD / 调试场景使用（见[迁移指南](./migration)）。

## 下一步

- 各域 API 详见左侧「主包 API」「子入口 API」分组
- 从 1.x 升级请先阅读 [v1 → v2 迁移指南](./migration)
