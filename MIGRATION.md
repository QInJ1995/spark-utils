# spark-utils 2.0 迁移指南（v1 → v2）

2.0 是一次破坏性重构：TypeScript 严格模式全量重写、具名导出、Node/浏览器同构、浏览器/加密/拼音拆分子入口、删除 41 项旧 API、合并 4 组重复 API、若干行为修复与安全重设计。本指南面向 1.x 使用者，逐条可操作。

## 目录

- [升级步骤总览](#升级步骤总览)
- [环境要求](#环境要求)
- [导入方式迁移](#导入方式迁移)
- [删除的 41 项](#删除的-41-项)
- [合并的 4 组 API](#合并的-4-组-api)
- [行为修复与变更](#行为修复与变更)
- [入口与依赖变化](#入口与依赖变化)

## 升级步骤总览

1. 确认 Node >= 18（见[环境要求](#环境要求)）；
2. 全局搜索以下导入与调用，按[删除清单](#删除的-41-项)逐项替换：
   - `SparkUtils.` 命名空间调用 → 具名导入；
   - `moment` 桥 8 方法 → `dayjs`；
   - `commafy` / `bind` / `invoke` / `onMountDialog` / IE 判定等；
3. 按对照表改造[合并的 4 组 API](#合并的-4-组-api)（`dateDiff` / `moneyFormat` / `findIndexOf` 族 / `md5Sign`）；
4. 核对[行为变更表](#行为修复与变更)，重点检查：`moneyFormat(0)`、证件校验出参、`copyText` 异步化、`crossDomain` 白名单、`https.*` → `createHttp`、crypto 抛错；
5. 全局配置改用 `setup({ ... })`（具名导出，浅合并不可变语义；`axiosConfig` 键已更名 `httpConfig`）；`mixin` 已移除，自建聚合替代（见[入口与依赖变化](#入口与依赖变化)）。

## 环境要求

| 项 | 1.x | 2.0 |
| --- | --- | --- |
| Node.js | 16 建议 | **>= 18**（`engines` 约束；`createHttp` 依赖原生 fetch / AbortController） |
| 浏览器 | 含 IE 分支 | 现代浏览器（IE 判定与分支全部删除） |
| TypeScript | - | 原生 TS，`.d.ts` 随包分发，无需 `@types` |

新增运行时依赖（自动安装，无需手动处理）：`dayjs`（moment 替换）、`crypto-js` 与 `jsrsasign`（仅 `spark-utils/crypto` 入口可达）。`moment` 不再依赖。

## 导入方式迁移

```ts
// ---------- 1.x：命名空间风格 ----------
import SparkUtils from 'spark-utils'
SparkUtils.debounce(fn, 300)
SparkUtils.isEmpty({})

import { crypto } from 'spark-utils'
crypto.aesEncrypt(data, key)

// ---------- 2.0：具名导出 ----------
import { debounce, isEmpty } from 'spark-utils'

// 浏览器 / 加密 / 拼音从子入口导入
import { copyText } from 'spark-utils/browser'
import { aesEncrypt } from 'spark-utils/crypto'
import { pinyin } from 'spark-utils/pinyin'
```

| 入口 | 内容 | 说明 |
| --- | --- | --- |
| `spark-utils` | basic / array / object / function / date / number / string / http / log / other（约 180 个具名导出） | Node 下可安全 import |
| `spark-utils/browser` | cookie / storage / dom / ua / url / crossDomain / clipboard（28 个导出） | Node 下 import 零副作用，调用返回空值/false |
| `spark-utils/crypto` | 12 个加解密方法（具名打平，不再经 `crypto.` 命名空间） | crypto-js / jsrsasign 仅此入口可达 |
| `spark-utils/pinyin` | `pinyin` 对象（`init` / `getFullChars` / `getCamelChars`） | 拼音字典独立分包 |
| `spark-utils/umd` | `dist/spark-utils.min.js` | UMD 产物保留（dayjs 已打入；不含 crypto 子入口） |

**default 聚合对象**：`import SparkUtils from 'spark-utils'` 的聚合形态在 2.0 保留兼容（165 个主包方法平铺；不再含 log/https/webStorage/crypto 嵌套命名空间），但会阻断 tree-shaking，新代码请一律使用具名导入（包声明 `sideEffects: false`，具名导入可被有效摇树）。

## 删除的 41 项

### 原生镜像（18 项）——直接改用原生 API

| 已删除 | 替代写法 |
| --- | --- |
| `keys(obj)` | `Object.keys(obj)` |
| `values(obj)` | `Object.values(obj)` |
| `entries(obj)` | `Object.entries(obj)` |
| `slice(array, start, end)` | `array.slice(start, end)` |
| `copyWithin(...)` | `array.copyWithin(...)` |
| `indexOf(obj, val)` | `Array.prototype.indexOf`，或谓词查找用 `findIndexOf` |
| `arrayIndexOf(list, val)` | 同上 |
| `lastIndexOf(obj, val)` | `Array.prototype.lastIndexOf`，或 `findLastIndexOf` |
| `arrayLastIndexOf(list, val)` | 同上 |
| `includes(obj, val)` | `array.includes(val)`；数组包含关系判定用保留的 `includeArrays` |
| `trim(str)` | `str.trim()` |
| `trimLeft(str)` | `str.trimStart()` |
| `trimRight(str)` | `str.trimEnd()` |
| `repeat(str, n)` | `str.repeat(n)` |
| `padStart(str, n, pad)` | `str.padStart(n, pad)` |
| `padEnd(str, n, pad)` | `str.padEnd(n, pad)` |
| `startsWith(str, val)` | `str.startsWith(val)` |
| `endsWith(str, val)` | `str.endsWith(val)` |

### IE 系（7 项）——2.0 不再支持 IE，无替代

`isIE` / `isIE9` / `isIE10` / `isIE11` / `IEVersion` / `notSupported`，以及 `getStyle` 的 `currentStyle` 分支。`getBrowserInfo` 不再识别 msie / Trident。

### moment 桥（8 项）——改用 dayjs

已删除：`moment` / `getMoment` / `stringToMoment` / `stringArrayToMomentArray` / `momentToString` / `momentArrayToStringArray` / `dateToMoment` / `momentToDate`。

```ts
import dayjs, { Dayjs } from 'dayjs'

// 旧 stringToMoment('2023-1-1', 'YYYY-MM-DD')
dayjs('2023-1-1')  // 常见格式自动识别；严格解析配合 customParseFormat 插件

// 旧 getMoment() —— 当前时间
dayjs()

// 旧 momentToString(m, 'YYYY-MM-DD')
m.format('YYYY-MM-DD')

// 旧 dateToMoment(new Date())
dayjs(date)

// 旧 momentToDate(m)
m.toDate()

// 旧 stringArrayToMomentArray(['2023-1-1', '2023-1-2'], 'YYYY-MM-DD')
;['2023-1-1', '2023-1-2'].map(s => dayjs(s))

// 旧 momentArrayToStringArray(arr, 'YYYY-MM-DD')
arr.map(m => m.format('YYYY-MM-DD'))
```

库内 `dateToString(date, format)` 保留，改用 dayjs 实现，token 与 moment 一致（`YYYY-MM-DD HH:mm:ss`）。

### 其他删除

| 已删除 | 替代方案 |
| --- | --- |
| `commafy(num, digits)` | `moneyFormat(num, digits)`（千分位逻辑并入，行为一致） |
| `function.bind(fn, ctx)` | 原生 `fn.bind(ctx)` 或箭头函数 |
| `array.invoke(list, method)` | `list.map(item => item[method]())` |
| `storage.init`（别名） | `createWebStorage`（该别名本就已标记弃用） |
| `onMountDialog` | Vue2 专属命令式弹窗挂载，不再随库分发；请用组件方式实现 |
| `log` 模块全部 8 导出（`info` / `warning` / `warn` / `error` / `success` / `table` / `image` / `createStyledLogger`） | 2.0 不再内置日志打印，请直接使用 `console` 或自建 logger |
| `https.axios` | 不再透出 axios 实例；需要 axios 请自行安装引入 |
| `https.init` / `https.submit` | `createHttp(config)` 实例的 `submit` 等（见[行为变更](#行为修复与变更)） |
| `submit` 的 `autoQs` 参数 | 对象请求体统一 JSON 序列化，未显式指定 Content-Type 时自动置 `application/json; charset=UTF-8` |

## 合并的 4 组 API

### 1. dateDiff + getDateDiff → `dateDiff(start, end, opts?)`

```ts
// ---------- 1.x ----------
dateDiff('2021-01-01', '2021-01-02', 'd')              // 单位差值
getDateDiff('2017-11-20', '2017-12-21')                 // 差值明细
getDateDiff('2017-11-20', '2017-12-21', customRules)    // 自定义规则明细

// ---------- 2.0 ----------
import { dateDiff } from 'spark-utils'

// 单位差值：字符串第三参仍兼容；规范形态为 options 对象
dateDiff('2021-01-01', '2021-01-02', 'd')
dateDiff('2021-01-01', '2021-01-02', { unit: 'd' })

// 差值明细：detailed: true
dateDiff('2017-11-20', '2017-12-21', { detailed: true })
// { done: true, time: 2678400000, yyyy: 0, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0 }

// 自定义规则：rules（[规则名, 毫秒数] 二元组列表）
dateDiff('2017-11-20', '2017-12-21', { detailed: true, rules: [['dd', 86400000]] })
```

注意：

- 单位语义：`'s'` 秒、`'n'` 分钟（旧名，仍可用）、`'m'` 分钟（**2.0 规范名**，与 `'n'` 等价；旧版 `'m'` 未映射会落入默认秒，属命名疏漏）、`'h'` 小时、`'d'` 天、`'w'` 周、`'M'` 月、`'y'` 年；
- 单位模式入参非法返回 `false`；明细模式结束日期缺省取当前时间，开始/结束非法或结束不晚于开始时返回 `{ done: false, time: 0 }`。

### 2. commafy + moneyFormat → `moneyFormat`

```ts
// ---------- 1.x ----------
commafy(1234567.891, 2)   // '1,234,567.89'
moneyFormat(1234567.891, 2)

// ---------- 2.0 ----------
import { moneyFormat } from 'spark-utils'
moneyFormat(1234567.891, 2)  // '1,234,567.89'
```

### 3. indexOf 族 → `findIndexOf` / `findLastIndexOf`

```ts
// ---------- 1.x ----------
indexOf(list, item)
arrayIndexOf(list, item)
lastIndexOf(list, item)
arrayLastIndexOf(list, item)

// ---------- 2.0 ----------
import { findIndexOf, findLastIndexOf } from 'spark-utils'

findIndexOf([11, 22, 33], 22)                 // 1（直接传值，或传谓词）
findIndexOf([11, 22, 33], item => item > 20)  // 1
findLastIndexOf([11, 22, 33, 22], 22)         // 3
```

对象场景返回键名：`findIndexOf({ a: 11, b: 22 }, item => item === 22) // 'b'`。

### 4. md5 双源 → crypto-js

`md5Sign` 统一由 crypto-js 实现（不再维护第二份自研实现），输出 32 位小写十六进制摘要；从 `spark-utils/crypto` 子入口导入。

```ts
// 1.x：import { crypto } from 'spark-utils'; crypto.md5Sign(...)
// 2.0：
import { md5Sign } from 'spark-utils/crypto'
md5Sign('你好，坤坤')  // 'b3e4a01478a0855984731f6bf4a4a11b'
```

## 行为修复与变更

### moneyFormat：0 值修复

| 调用 | 1.x | 2.0 |
| --- | --- | --- |
| `moneyFormat(0)` | `''` | `'0'` |
| `moneyFormat(0, 2)` | `''` | `'0.00'` |
| `moneyFormat(null)` / `moneyFormat('abc')` / `moneyFormat('')` | `''` | `''`（不变） |

### 证件三校验：出参统一为判别对象

`validate2ndIdCard` / `hkIdVerify` / `macauIdCard` 统一返回 `{ valid, code?, msg? }`；旧版 `errors` 数组出参参数删除（不再有副作用收集）。

```ts
// ---------- 1.x ----------
const errors: string[] = []
validate2ndIdCard(id, errors)      // 返回 undefined，失败向 errors push
hkIdVerify(id, errors)             // 返回 true/false

// ---------- 2.0 ----------
import { validate2ndIdCard } from 'spark-utils'

const result = validate2ndIdCard('11010519491231002X')
if (!result.valid) {
  console.log(result.code)  // 'LENGTH' | 'PATTERN' | 'CHECKSUM'
  console.log(result.msg)   // 失败原因文案
}
```

### debounce / throttle：第三参缺省不再抛 TypeError

1.x 不传第三参（`options`）直接抛 `TypeError`（读取 `undefined.leading`）；2.0 第三参可选，缺省按 trailing 执行。布尔简写保留：`true` 等价 `{ leading: true }`、`false` 等价 `{ trailing: true }`。返回的包装函数均带 `cancel()`。

### isWindow：Node 下返回 false

Node / 非浏览器环境返回 `false`（1.x 返回 `0`）。其余 isXxx 家族在 Node 下的行为同构化：涉及浏览器全局的判定安全返回 `false` 而非抛错。

### log 模块：整体移除

`info` / `warning` / `warn` / `error` / `success` / `table` / `image` / `createStyledLogger` 共 8 个导出随 log 模块整体移除（2.0 不再内置日志打印，请直接使用 `console` 或自建 logger）。`setup` 的 `showLog` 字段保留，仅用于门控 `spark-utils/browser` 中 storage 写入的操作日志。

### copyText：改为异步

```ts
// 1.x：const ok = copyText(text)      // 同步 boolean
// 2.0：
import { copyText } from 'spark-utils/browser'
const ok = await copyText(text)  // Promise<boolean>；优先 Clipboard API，失败回退 execCommand
```

### crossDomain：重设计为 setupCrossDomain（安全破坏点）

1.x 在模块加载时即向 `window` 挂载 `receiveMessage` / `sendMessage` 全局并注册监听，且以 `eval` 执行消息携带的任意函数名——等于向任何能 postMessage 的来源开放任意代码执行。2.0 改为白名单注册：

```ts
// ---------- 2.0 ----------
import { setupCrossDomain, sendMessage } from 'spark-utils/browser'

const handle = setupCrossDomain({
  allowOrigins: ['https://child.example.com'],       // 来源白名单（精确匹配）
  allowCalls: { getUser: arg => ({ id: 1 }) },       // 仅白名单内的函数可被调用（替代 eval）
  targetOrigin: 'https://child.example.com',         // 建议显式指定（默认 '*' 仅保底）
})

sendMessage('iframeId', 'refresh', { force: true }, 'onRefreshed')
handle.destroy()   // 注销监听（幂等）
```

变更点：import 零副作用（未 setup 不监听）；来源与调用名双白名单，未注册一律丢弃；不再挂 window 全局；消息协议字段（`crossDomain` / `call` / `callFun` / `arg` / `callBackFun`）不变。

### https.init / https.axios / https.submit → createHttp（fetch）

```ts
// ---------- 1.x（axios 封装，全局单例） ----------
import SparkUtils from 'spark-utils'
SparkUtils.https.init({ baseURL, timeout, headers })
const res = await SparkUtils.https.submit({ url, data, autoQs: true })

// ---------- 2.0（原生 fetch，独立实例） ----------
import { createHttp } from 'spark-utils'

const http = createHttp({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: { Authorization: 'Bearer token' },
  beforeRequest: init => { init.headers.Authorization = token },   // 替代 interceptors.request
  afterResponse: res => console.log(res.status),                  // 替代 interceptors.response
})

const data = await http.get<User[]>('/users', { page: '1' })  // 直接返回反序列化数据
await http.post('/users', { name: 'spark' })                   // 对象自动 JSON 序列化 + JSON 头
await http.submit({ url: '/login', data: { user, pass } })     // autoQs 已删除
```

### crypto：错误统一抛 CryptoError

1.x 加解密失败静默返回 `false` 等假值；2.0 统一抛出类型化 `CryptoError`（含失败原因），调用方需按需 try/catch。方法清单不变（12 个），调用方式从 `crypto.xxx` 命名空间改为具名导入。另有三处细节：

- **AES 新增密钥长度校验**：密钥非 16/24/32 字节或 IV 非 16 字节抛 `INVALID_KEY`。旧版对错误长度密钥静默产出**自身都无法解回**的乱码密文（属修 bug 性质收紧）；合法长度但错误的密钥解密仍返回乱码不抛错（CBC 无认证，与旧版一致）。
- **rsaVerify**：密钥/签名解析失败旧版返回 `false`，2.0 抛 `VERIFY_FAILED`；验签不通过仍返回 `false`（与旧版一致）。
- **md5Sign** 底层从 jsrsasign 内置 CryptoJS 切换为 crypto-js（输出逐字节一致，仅依赖面收敛）。

### storage：若干修复

| 项 | 1.x | 2.0 |
| --- | --- | --- |
| `init` 别名 | 转发 + 弃用日志 | 删除（用 `createWebStorage`） |
| `getStorage` 创建失败 | 继续 `getAll()` 抛 `TypeError` | 返回 `null` |
| 实例 `remove` 未初始化 | 返回 `undefined` | 返回 `false`（归一化 boolean） |
| 读写性能 | 每次 `JSON.parse` 整个原始串 | 实例级缓存（跨实例写入自动失效） |
| 存储日志 | 无条件 `console.log` | 经日志开关门控 |

### browser 域：惰性函数化

- `clientBrowser` / `clientSystem` / `clientScreenSize` 由**加载期求值的常量**改为**函数**：`clientBrowser()`、`clientSystem()`、`clientScreenSize()`；
- `cookie` 域的 `setCookie(name, value, seconds, path)` / `getCookie(name)`（未命中返回 `null`）/ `getToken(name?)` 保留为兼容别名（与 `cookie` 主函数合并为唯一实现）；`getToken` 收紧为精确键名匹配；`expires` 为 NaN（含 Invalid Date）时不再抛 `TypeError`；
- 所有浏览器全局访问惰性求值：Node 下 import `spark-utils/browser` 零副作用，`locat()` / `getBaseURL()` 返回空值，`copyText` / cookie 写入返回 `false`。

## 入口与依赖变化

| 项 | 1.x | 2.0 |
| --- | --- | --- |
| 导出形态 | default 聚合对象 + 部分具名 | 具名导出为主（default 聚合对象保留兼容，173 方法平铺） |
| 包管理导出 | 单入口 | `exports` map：`.` / `./browser` / `./crypto` / `./pinyin` / `./umd`，含 `types` 条件 |
| UMD | `dist/spark-utils.min.js` | 保留（dayjs 已打入；crypto 子入口不在 UMD 内） |
| sideEffects | - | `false`（tree-shaking 友好） |
| 日期依赖 | `moment` | `dayjs`（`dateToString` token 一致） |
| 加密依赖 | 内置多套自研实现 | `crypto-js`（AES/MD5）+ `jsrsasign`（RSA/SM），仅 crypto 入口可达 |
| 拼音字典 | 随主包 | `spark-utils/pinyin` 子入口独立分包 |
| 全局配置 | `setup` / `setupDefaults` / `mixin`（可变单例） | `setup` / `setupDefaults` 具名导出（深度冻结不可变，`axiosConfig` 更名 `httpConfig`，`mixin` 移除） |

## 常见问题

**Q：`import { isEmpty } from 'spark-utils'` 报「没有导出的成员」？**
确认升级到 2.0 版本；`keys` / `values` / `entries` / moment 桥等 41 项已删除（见删除清单）。

**Q：Node 下 `log` / `table` 不输出了？**
2.0 已随 log 模块整体移除（见行为变更表），该问题不复存在；`showLog` 仅继续门控 browser 子入口 storage 的写入日志。

**Q：`copyText` 返回值变成 Promise 了？**
是 2.0 破坏点，改用 `await copyText(text)`。

**Q：crypto 解密失败没有返回 false？**
2.0 统一抛 `CryptoError`，请 try/catch 处理。
