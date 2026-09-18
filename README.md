# spark-utils

同构 JavaScript / TypeScript 工具库（Node 与浏览器通用）。2.0 以 TypeScript 严格模式全量重写：具名导出、按子入口分包、原生 fetch / dayjs 引擎、tree-shaking 友好。

## 安装

Node.js >= 18。

::: code-group

```sh [npm]
npm install spark-utils
```

```sh [pnpm]
pnpm add spark-utils
```

```sh [yarn]
yarn add spark-utils
```

:::

## 子入口矩阵

| 入口 | 内容 | 体积特征 |
| --- | --- | --- |
| `spark-utils` | 基础 / 数组 / 对象 / 函数 / 日期 / 数值 / 字符串 / http / log / other（176 个具名导出） | minify+gzip 约 17KB（不含 dayjs）；dayjs 为 external 依赖；Node 可安全 import |
| `spark-utils/browser` | cookie / storage / dom / ua / url / crossDomain / clipboard（28 个导出） | 轻量；懒求值，Node 下 import 零副作用 |
| `spark-utils/crypto` | `aesEncrypt` `aesDecrypt` `md5Sign` `rsaEncrypt` `rsaDecrypt` `rsaSign` `rsaVerify` `sm4Encrypt` `sm4Decrypt` `sm3Sign` `sm2Encrypt` `create64Key` | 较重；crypto-js + jsrsasign 仅此入口可达 |
| `spark-utils/pinyin` | `pinyin` 对象（`getFullChars` / `getCamelChars` / `init`） | 拼音字典独立分包 |
| `spark-utils/umd` | `dist/spark-utils.min.js` | UMD 单文件（dayjs 已打入），供 `<script>` 直引 |

## 最小示例

```ts
import { debounce, isEqual, dateDiff, moneyFormat } from 'spark-utils'

// TS 下直接获得参数与返回值提示：
// opts?: { unit?: 's' | 'n' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'; detailed?: boolean; rules?: ... }
dateDiff('2024-01-01', '2024-02-01', { unit: 'd' })   // 31

moneyFormat(1234567.891, 2)   // '1,234,567.89'
isEqual({ a: 1 }, { a: 1 })   // true

// 防抖：第三参可省（不再抛 TypeError），返回值带 cancel()
const search = debounce((kw: string) => load(kw), 300)
```

浏览器与加密能力从子入口按需引入：

```ts
import { copyText } from 'spark-utils/browser'        // await copyText(text) → Promise<boolean>
import { aesEncrypt } from 'spark-utils/crypto'       // 失败抛 CryptoError
import { pinyin } from 'spark-utils/pinyin'           // pinyin.getFullChars('我喜欢你') → 'WoXiHuanNi'
```

## tree-shaking

包声明 `sideEffects: false`，全部入口为 ESM 具名导出——只引入用到的函数即可被有效摇树。`import SparkUtils from 'spark-utils'`（default 聚合对象）会阻断摇树，仅建议 UMD / 调试场景使用。

## 文档

- 在线文档：VitePress 站点（本仓库 `docs/`，`npm run docs:dev` 本地启动）
- [v1 → v2 迁移指南](./MIGRATION.md)：删除 41 项 / 合并 4 组 / 行为变更逐条对照

## 提交规范

- feat：提交新功能
- fix：修复了 bug
- docs：只修改了文档
- style：调整代码格式，未修改代码逻辑
- refactor：代码重构，既没修复 bug 也没有添加新功能
- perf：性能优化
- test：添加或修改代码测试
- chore：对构建流程或辅助工具和依赖库的更改

## Author

**spark-utils** © QINJIN, Released under the ISC License.
