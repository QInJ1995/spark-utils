# v1 → v2 迁移指南

2.0 是破坏性重构：TypeScript 严格重写、具名导出、同构化、子入口分包、删除 41 项、合并 4 组 API、若干行为修复。本页是速览版；逐条可操作的完整清单见仓库根目录的 `MIGRATION.md` 文件。

## 导入方式

```ts
// 1.x：命名空间风格
import SparkUtils from 'spark-utils'
SparkUtils.debounce(fn, 300)
import { crypto } from 'spark-utils'
crypto.aesEncrypt(data, key)

// 2.0：具名导出
import { debounce } from 'spark-utils'
import { aesEncrypt } from 'spark-utils/crypto'
import { copyText } from 'spark-utils/browser'
import { pinyin } from 'spark-utils/pinyin'
```

default 聚合对象（`import SparkUtils from 'spark-utils'`）在 2.0 保留兼容（M7 落地），但会阻断 tree-shaking，不推荐新代码使用。

## 删除了 41 项

### 原生镜像（改用原生 API）

| 已删除 | 替代 |
| --- | --- |
| `keys` / `values` / `entries` | `Object.keys` / `Object.values` / `Object.entries` |
| `slice` / `copyWithin` | `Array.prototype.slice` / `copyWithin` |
| `indexOf` / `arrayIndexOf` / `lastIndexOf` / `arrayLastIndexOf` | `findIndexOf` / `findLastIndexOf`（谓词版）或 `Array.prototype.indexOf` |
| `includes` | `Array.prototype.includes`（判数组包含关系用 `includeArrays`） |
| `trim` / `trimLeft` / `trimRight` | `String.prototype.trim` / `trimStart` / `trimEnd` |
| `repeat` / `padStart` / `padEnd` | 同名 `String.prototype` 方法 |
| `startsWith` / `endsWith` | 同名 `String.prototype` 方法 |

### IE 系（7 个）

`isIE` / `isIE9` / `isIE10` / `isIE11` / `IEVersion` / `notSupported` / `getStyle` 的 `currentStyle` 分支——2.0 不再支持 IE，无替代。

### moment 桥（8 个，改用 dayjs）

`moment` / `getMoment` / `stringToMoment` / `stringArrayToMomentArray` / `momentToString` / `momentArrayToStringArray` / `dateToMoment` / `momentToDate`

```ts
// 旧：stringToMoment('2023-1-1', 'YYYY-MM-DD')
import dayjs from 'dayjs'
dayjs('2023-1-1')                       // dayjs 自动识别常见格式
dayjs('2023-1-1', 'YYYY-MM-DD')         // 需严格解析时配合 customParseFormat 插件

// 旧：momentToDate(moment('2023-1-1'))
dayjs('2023-1-1').toDate()
```

`dateToString` 保留且 token 与 moment 一致（`YYYY-MM-DD HH:mm:ss`）。

### 其他删除

| 已删除 | 说明 / 替代 |
| --- | --- |
| `commafy` | 并入 `moneyFormat`（千分位逻辑一致） |
| `function.bind` | 原生 `Function.prototype.bind` / 箭头函数 |
| `array.invoke` | `map` + 调用 |
| `storage.init` | 已弃用别名，用 `createWebStorage` |
| `onMountDialog` | Vue2 专属命令式弹窗，不再随库分发 |
| `https.axios` / `https.init` / `https.submit` | 换 `createHttp`（见下） |
| `autoQs`（submit 参数） | 对象请求体统一 JSON 序列化并自动置 JSON 头 |
| `eval` 版 crossDomain | 换 `setupCrossDomain` 白名单（见下） |

## 合并了 4 组

### dateDiff + getDateDiff → dateDiff

```ts
// 旧 dateDiff（单位差值）——字符串第三参仍兼容
dateDiff('2021-01-01', '2021-01-02', 'd')            // 仍可用
dateDiff('2021-01-01', '2021-01-02', { unit: 'd' })  // 2.0 规范形态

// 旧 getDateDiff（差值明细）——detailed: true
dateDiff('2017-11-20', '2017-12-21', { detailed: true })
// { done: true, time: 2678400000, yyyy: 0, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0 }
```

`'m'`（分钟）为 2.0 规范单位名，与旧名 `'n'` 等价。

### commafy + moneyFormat → moneyFormat

```ts
// 旧 commafy(1234567.891, 2)
moneyFormat(1234567.891, 2) // '1,234,567.89'
```

### indexOf 族 → findIndexOf / findLastIndexOf

```ts
// 旧 indexOf(obj, item) / arrayIndexOf(list, item)
findIndexOf([11, 22, 33, 22], 22)                 // 1
findIndexOf(list, item => item > 20)              // 也支持谓词
findLastIndexOf([11, 22, 33, 22], 22)             // 3
```

### md5 双源 → crypto-js

`md5Sign` 统一由 crypto-js 实现（结果为小写十六进制），从 `spark-utils/crypto` 导入。

## 行为变更

| 方法 | 1.x | 2.0 |
| --- | --- | --- |
| `moneyFormat(0)` | `''` | `'0'`（`0, 2` → `'0.00'`） |
| 证件三校验出参 | 返回值各异 + `errors` 数组副作用 | 统一 `{ valid, code?, msg? }` 判别对象 |
| `debounce` / `throttle` 第三参不传 | 抛 `TypeError` | 正常按 trailing 执行 |
| `isWindow`（Node 下） | `0` | `false` |
| `log` 系列（Node 下） | 默认打印 | 默认静默（浏览器仍默认开启） |
| `copyText` | 同步返回 `boolean` | `async`，返回 `Promise<boolean>` |
| `crossDomain` | import 即挂全局 + `eval` 执行 | `setupCrossDomain` 显式注册 + 双白名单，无 `eval` |
| `https.init` 等 | axios 封装 | `createHttp`（原生 fetch，钩子 `beforeRequest` / `afterResponse`） |
| crypto 系列错误 | 静默返回 `false` 等 | 抛 `CryptoError` |
| `getStorage`（创建失败） | 继续 `getAll()` 抛 `TypeError` | 返回 `null` |
| `clientBrowser` / `clientSystem` / `clientScreenSize` | 加载期求值的常量 | 惰性**函数**，调用时求值 |

## 全局配置

`setup` / `setupDefaults` / `mixin`（1.x 全局配置与扩展）正在随 M7 里程碑重新设计中，暂不在 2.0 导出面内；`axiosConfig` 配置槽更名为 `httpConfig`。依赖全局配置的代码请关注 M7 落地说明。

## Node 版本

2.0 要求 **Node >= 18**（原生 fetch、AbortController）。
