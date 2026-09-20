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

## 环境要求

- Node.js >= 18（`package.json` `engines` 约束；`createHttp` 依赖原生 fetch）
- 现代浏览器（IE 系列判定与分支已随 2.0 删除）

## 反馈与贡献

- 提交遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `chore`
