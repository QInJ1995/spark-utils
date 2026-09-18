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
| `spark-utils` | 主包：类型判定 / 数组 / 对象 / 函数 / 日期 / 数值 / 字符串 / http / other（168 个具名导出） | 轻量（minify+gzip 约 17KB 不含 dayjs）；dayjs 为 external 依赖；无浏览器全局触碰 | 安全（推荐） |
| `spark-utils/browser` | 浏览器专属 28 个方法：cookie / storage / dom / ua / url / crossDomain / clipboard | 轻量；懒求值，Node 下 import 零副作用 | 安全（调用返回空值/false） |
| `spark-utils/crypto` | 12 个加解密方法：AES / MD5 / RSA / SM 系列 / create64Key | 较重（crypto-js + jsrsasign 仅此入口可达） | 可用 |
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

## 全局配置

`setup` 具名导出，浅合并生成**深度冻结**的新配置并即时生效（1.x 的可变单例已移除；旧 `axiosConfig` 键更名 `httpConfig`）：

```ts
import { setup, setupDefaults } from 'spark-utils'

// 常用配置项：showLog（browser 子入口 storage 写入日志开关）、
// httpConfig（createHttp 默认）、treeOptions（树形方法默认键名）、
// formatDate / formatString（日期解析与输出默认格式）、cookies（写入默认项）
setup({ treeOptions: { parentKey: 'pid', key: 'id', children: 'nodes' } })

setupDefaults // 默认配置（只读）
```

注意：嵌套对象整体替换（不做深合并）且传入后会被冻结，请每次传入全新对象。

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
