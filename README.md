# spark-utils

<p align="center">
  <a href="https://www.npmjs.com/package/spark-utils"><img src="https://img.shields.io/npm/v/spark-utils.svg" alt="npm version"></a>
  <a href="https://github.com/QInJ1995/spark-utils/actions/workflows/ci.yml"><img src="https://github.com/QInJ1995/spark-utils/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://img.shields.io/badge/node-%3E%3D18-brightgreen"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="node"></a>
  <a href="https://img.shields.io/badge/TypeScript-strict-blue"><img src="https://img.shields.io/badge/TypeScript-strict-blue" alt="TypeScript"></a>
  <a href="https://img.shields.io/badge/license-ISC-green"><img src="https://img.shields.io/badge/license-ISC-green" alt="license"></a>
</p>

**同构 JavaScript / TypeScript 工具库**——类型判定、数组、对象、函数、日期、数值金额、字符串脱敏、网络请求、浏览器能力与加解密，一个包覆盖日常开发的常用场景。

2.0 是一次全面重构：TypeScript 严格模式重写、全量具名导出、Node 与浏览器同构、浏览器 / 加密 / 拼音拆分为独立子入口。

## ✨ 特性

- **TypeScript 原生** —— 严格模式重写全部模块，`import { debounce } from 'spark-utils'` 即获得完整参数与返回值类型提示；类型随 npm 包直接分发（`.d.ts`），无需额外安装 `@types` 包
- **同构** —— 主入口在 Node 下可安全 `import`，所有浏览器全局访问均为惰性求值；`createHttp` 基于原生 `fetch`，Node 18+ 与浏览器行为一致
- **子入口分包** —— 体积较大的能力独立成入口（`browser` / `crypto` / `pinyin`），主包保持轻量（minify + gzip 约 16KB，不含 dayjs）
- **tree-shaking 友好** —— `sideEffects: false` + ESM 具名导出，只引入用到的函数即可被打包器有效摇树
- **安全重设计** —— 跨文档通讯移除 `eval` 改为白名单注册（`setupCrossDomain`）；网络请求由 axios 换为原生 `fetch`；加密错误统一抛出类型化 `CryptoError`；剪贴板优先走异步 Clipboard API
- **质量守门** —— 900+ 用例以 1.x 行为快照为基线全量回归，语句 / 分支 / 函数覆盖率 95% / 87% / 97%，CI 在 node 18 / 20 / 22 三版本矩阵上运行八道闸门

## 📦 安装

环境要求：[Node.js](https://nodejs.org/) **>= 18**（2.0 起 `engines.node` 约束；`createHttp` 依赖原生 fetch）。

```sh
npm install spark-utils
# 或
pnpm add spark-utils
# 或
yarn add spark-utils
```

## 🚀 快速上手

主入口全部为**具名导出**：

```ts
import { debounce, isEqual, dateDiff, moneyFormat, cnMoneyFormat } from 'spark-utils'

// 类型提示直接可用：unit 为 's' | 'n' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'
dateDiff('2024-01-01', '2024-02-01', { unit: 'M' })  // 1（自然月差）

moneyFormat(1234567.891, 2)   // '1,234,567.89'
cnMoneyFormat(1234567.89)     // '壹佰贰拾叁万肆仟伍佰陆拾柒元捌角玖分'
isEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })  // true

// 防抖：第三参可省，返回值带 cancel()
const search = debounce((kw: string) => load(kw), 300)
```

浏览器能力、加密与拼音从对应子入口按需引入：

```ts
import { copyText, parseUrl, createWebStorage } from 'spark-utils/browser'

const ok = await copyText('你好，spark-utils')   // 异步 Clipboard API，Promise<boolean>
parseUrl('https://a.com:8080/p?q=1#frag').searchQuery   // { q: '1' }
```

```ts
import { aesEncrypt, aesDecrypt } from 'spark-utils/crypto'

const cipher = aesEncrypt('data', 'abcdefghijkl', 'opqrstuvwxyz')
aesDecrypt(cipher, 'abcdefghijkl', 'opqrstuvwxyz')   // 'data'（失败抛 CryptoError）
```

```ts
import { pinyin } from 'spark-utils/pinyin'

pinyin.getFullChars('我喜欢你')   // 'WoXiHuanNi'
pinyin.getCamelChars('我喜欢你')  // 'WXHN'
```

全局配置（`setup`）一次设置全局生效，浅合并生成深度冻结的只读配置：

```ts
import { setup } from 'spark-utils'

// 后端平铺列表用 pid 作父键时，树形方法无须逐处传参
setup({ treeOptions: { parentKey: 'pid', key: 'id', children: 'nodes' } })
```

也可经 UMD 单文件直引（dayjs 已打入，全局变量 `SparkUtils`）：

```html
<script src="https://unpkg.com/spark-utils/dist/spark-utils.min.js"></script>
<script>
  const { debounce, moneyFormat } = SparkUtils
</script>
```

## 📚 子入口一览

| 入口 | 内容 | 体积特征 | Node 下 import |
| --- | --- | --- | --- |
| `spark-utils` | 主包 169 个具名导出：基础 / 数组 / 对象 / 函数 / 日期 / 数值 / 字符串 / http / other | 约 16KB（minify + gzip，不含 dayjs） | 安全（推荐） |
| `spark-utils/browser` | 浏览器专属 28 个：cookie / storage / dom / ua / url / crossDomain / clipboard | 轻量；懒求值 | 零副作用 |
| `spark-utils/crypto` | 加解密 11 个：AES / MD5 / RSA 签名验签 / SM2 / SM3 / SM4 / `create64Key` | 较重；crypto-js + jsrsasign 仅此入口可达 | 可用 |
| `spark-utils/pinyin` | `pinyin` 对象（`init` / `getFullChars` / `getCamelChars`） | 拼音字典独立分包 | 可用 |
| `spark-utils/umd` | `dist/spark-utils.min.js`（UMD 产物） | 单文件，供 `<script>` 直引 | - |

> jsrsasign 11 起 RSA 加解密原语因 Marvin Attack（CVE-2024-21484）被移除，故 2.0 无 `rsaEncrypt` / `rsaDecrypt`，保留 `rsaSign` / `rsaVerify`。

## ⚙️ 全局配置

`setup` 支持的配置域：`showLog`（storage 日志开关）、`httpConfig`（`baseURL` / `timeout` / `headers`）、`promiseResultConfig`、`treeOptions`（`parentKey` / `key` / `children`）、`formatDate` / `formatString` / `dateDiffRules`（日期缺省格式与换算规则）、`cookies`（browser 子入口写入默认值）。完整配置表见[在线文档](https://github.com/QInJ1995/spark-utils/tree/main/docs)。

## 📖 文档

- **在线文档** —— VitePress 站点（本仓库 `docs/` 目录，`npm run docs:dev` 本地启动），含全部 12 个域的 API 说明与可运行示例
- **[v1 → v2 迁移指南](./MIGRATION.md)** —— 删除 41 项 / 合并 4 组 / 行为变更逐条对照

## 🔄 从 1.x 迁移

2.0 存在破坏性变更：具名导出取代命名空间（`log` / `https` / `webStorage` / `crypto`）、moment 桥接移除（迁移至 dayjs 原生写法）、加密错误改抛 `CryptoError`（不再静默返回 `false`）、三地证件校验统一出参 `{ valid: boolean; code?: string }`。升级前请通读[迁移指南](./MIGRATION.md)。

## 🤝 贡献

欢迎提交 [Issue](https://github.com/QInJ1995/spark-utils/issues) 与 [Pull Request](https://github.com/QInJ1995/spark-utils/pulls)。提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

| 类型 | 说明 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档变更 |
| `style` | 代码格式调整（不改变逻辑） |
| `refactor` | 重构（既非新增功能也非修复） |
| `perf` | 性能优化 |
| `test` | 测试新增 / 修改 |
| `chore` | 构建流程或辅助工具变更 |

## 📄 License

[ISC](./LICENSE) © QINJIN

## 作者

**spark-utils** © QINJIN. Released under the ISC License.
