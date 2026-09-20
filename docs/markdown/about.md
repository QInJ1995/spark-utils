# 简介

spark-utils 是一个功能丰富、可扩展的**同构 JavaScript / TypeScript 工具库**，覆盖类型判定、数组、对象、函数、日期、数值金额、字符串脱敏、网络请求、浏览器能力与加解密等日常开发场景。

2.0 是一次全面重构：TypeScript 严格模式重写、全量具名导出、Node 与浏览器同构、浏览器/加密/拼音拆分为独立子入口。

::: info TypeScript 原生
2.0 以 TS 严格模式重写全部模块，`import { debounce } from 'spark-utils'` 即获得完整参数与返回值类型提示；类型随 npm 包直接分发（`.d.ts`），无需额外安装 `@types` 包。
:::

::: info 同构（Node 与浏览器通用）
主入口在 Node 下可安全 `import`——所有 `window` / `document` / `location` 访问都做了惰性求值，不会在加载期触碰浏览器全局。浏览器专属能力（cookie / storage / dom / ua / url / crossDomain / clipboard）收敛在 `spark-utils/browser` 子入口，Node 下 import 该入口同样零副作用。
:::

::: info 子入口分包
体积较大的能力独立成子入口：`spark-utils/browser`（28 个浏览器方法）、`spark-utils/crypto`（10 个加解密方法，crypto-js / jsrsasign 仅在此入口可达）、`spark-utils/pinyin`（拼音字典）。主包保持轻量，`sideEffects: false` 对打包器友好。
:::

::: info 安全重设计
跨文档通讯移除 `eval` 改为白名单注册（`setupCrossDomain`）；网络请求由 axios 封装换为原生 `fetch`（`createHttp`）；加密错误统一抛出类型化 `CryptoError`；剪贴板优先走异步 Clipboard API。
:::

## 功能总览

主入口 169 个具名导出（含 `setup` / `setupDefaults`），按域组织；浏览器 / 加密 / 拼音为独立子入口：

| 域 | 入口 | 代表能力 |
| --- | --- | --- |
| 基础（47） | `spark-utils` | `isXxx` 类型判定家族、`isEqual` / `isEqualWith` 深比较、`each` 迭代、`toStringJSON` / `toJSONString`、`range` / `uniqueId` |
| 数组（38） | `spark-utils` | 树结构七法（`toArrayTree` / `eachTree` / `mapTree` 等）、`orderBy` / `groupBy`、`uniq` / `zip` / `chunk`、`shuffle` / `sample` |
| 对象（13） | `spark-utils` | `get` / `set` 点路径读写、`merge` 深合并、`pick` / `omit`、`destructuring` |
| 函数（8） | `spark-utils` | `debounce` / `throttle`（带 `cancel`）、`once` / `after` / `before`、`delay` / `loop` |
| 日期时间（25） | `spark-utils` | `dateDiff`（单位 + 明细双模式）、`dateToString`（dayjs）、`toStringDate` / `toDateString`、`getWhatYear` / `getWhatWeek` 系列 |
| 数值金额（16） | `spark-utils` | `moneyFormat` 千分位、`cnMoneyFormat` 中文大写、`add` 等精确四则、`random` |
| 字符串（12） | `spark-utils` | `template` 插值、`escape` / `unescape`、`camelCase` / `kebabCase`、`format` 脱敏、`uuid` |
| 网络请求 | `spark-utils` | `createHttp`（fetch 同构封装，`get` / `post` / `put` / `delete` / `submit`） |
| 其他（5） | `spark-utils` | `StateFlow` 状态容器、`promiseResultHandle`、三地证件校验 |
| 浏览器（28） | `spark-utils/browser` | cookie / WebStorage / DOM 取值 / UA 探测 / URL 解析序列化 / `copyText` / `setupCrossDomain` |
| 加密（11） | `spark-utils/crypto` | AES、MD5、RSA 签名验签、SM2 / SM3 / SM4 国密、`create64Key`（`CryptoError`） |
| 拼音 | `spark-utils/pinyin` | `pinyin.getFullChars` / `pinyin.getCamelChars`（多音字开关） |

各域完整方法说明见左侧「主包 API」「子入口 API」分组的对应页面。

## 工程质量

- **行为对照测试**：以 1.x 的行为快照（fixtures 矩阵）为基线，926 用例全量回归（node + jsdom 双环境），确保 2.0 重写不引入行为漂移；
- **覆盖率守门**：语句 / 分支 / 函数覆盖率 95% / 87% / 97%，CI 阈值卡线（88 / 80 / 90 / 88）；
- **CI 矩阵**：node 18 / 20 / 22 × lint + 分层依赖检查 + 四链类型检查 + 测试 + 覆盖率 + 构建 + 体积守门（主包 gzip < 25KB）+ 文档构建；
- **分层架构**：internal 层 L0→L2 单向依赖，公共域模块禁止横向互引（dependency-cruiser 强制零环）。

## 环境要求

- Node.js >= 18（`package.json` `engines` 约束；`createHttp` 依赖原生 fetch）
- 现代浏览器（IE 系列判定与分支已随 2.0 删除）

## 反馈与贡献

- 提交遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `chore`
