# 更新日志

本项目的所有显著变更记录在本文件中（格式参照 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)）。

## [2.0.0] - 未发布

TypeScript 严格模式重写 + Rollup 多入口构建 + Node/浏览器同构。完整迁移指引见 [MIGRATION.md](./MIGRATION.md)。

### 破坏性变更

- **TypeScript 重写**：全库 strict（`noUncheckedIndexedAccess` / `exactOptionalPropertyTypes`），类型随包发布（191 个 d.ts）；
- **入口拆分**：单一 UMD 平铺改为 `spark-utils`（主包，Node 可安全 import）+ `spark-utils/browser` + `spark-utils/crypto` + `spark-utils/pinyin` 四入口，具名导出全面替代命名空间对象；`default` 导出保留旧平铺形状，UMD 产物（全局 `SparkUtils`）继续提供；
- **依赖置换**：moment（~70KB）→ dayjs（external，~7KB）；axios → 原生 fetch（`createHttp`，Node 18+ / 浏览器同构，`https.init` 迁移为 `createHttp`）；主包 gzip 体积 17KB+ → 约 16KB；
- **删除 43 项导出**：纯原生镜像（`keys` / `values` / `slice` / `trim` 等）、旧 IE UA 嗅探（`isIE` 全家族）、moment 桥接 8 法、`log` 模块整体、`https.axios`、`commafy`（并入 `moneyFormat`）、`rsaEncrypt` / `rsaDecrypt`（jsrsasign 11 因 Marvin Attack 移除该原语，迁移示例见 MIGRATION）等；
- **合并 4 组 API**：`dateDiff` + `getDateDiff` → `dateDiff(start, end, opts)`；`commafy` + `moneyFormat` → `moneyFormat`；md5 双源 → `md5Sign`；indexOf 同族收敛为 `findIndexOf` / `findLastIndexOf`；
- **crypto 全线改抛 `CryptoError`**（六错误码，见 docs/crypto）：旧版吞错返回 `false` 的行为不再保留；
- **三地证件校验统一出参** `{ valid: boolean; code?: string; msg?: string }`；
- **运行环境**：Node ≥ 18（fetch / WebCrypto 探测按此基线）。

### 修复（对照 1.1.10 行为基线）

- `moneyFormat` 0 值被 `!money` 守卫吞为空串；
- `cookie` 单位串过期错算（`'1h'` / `'12h'` / `'2y'` 全按天数）；setupDefaults.cookies 未定义崩溃；
- `getStyle` 驼峰属性名取值返回空串（kebab 归一）；
- `createHttp` 超时误报（afterResponse 抛错 / 4xx 与计时器竞态被吞为 timeout）、空 url 静默失败、字符串体继承表单 Content-Type；
- `StateFlow` 深层路径中途假值抛 TypeError；`toArrayTree` null 入参 + sortKey 抛 "list is not iterable"；
- webStorage 过期实例静默损毁外部数据（三态解析改造）；存储读取性能（实例级缓存，单次 get 由 2 读 1 写降为 1 读 1 写）；
- `shuffle` / `sample` 等 30+ 处 xe-utils 原版缺陷，行为对照经 fixtures 快照矩阵锁定。

### 工程化

- 行为快照测试管线（fixtures + overrides 白名单）：926 用例（908 过 / 18 条件跳过），覆盖率 95.06% / 分支 87.14% / 函数 97.38%（CI 阈值 88 / 80 / 90 / 88 守门）；
- ESLint + dependency-cruiser 分层守卫（internal L0→L2 单向，公共域禁横向互引）+ tsc 四链类型检查；
- CI（GitHub Actions，node 18 / 20 / 22 矩阵）：lint / depcruise / typecheck / test / coverage / build / size（25KB 守门）/ docs:build；
- VitePress 文档站全量重写 + MIGRATION.md 迁移指南；ISC LICENSE。

## [1.1.10] - 2025-05-12

1.x 维护版基线（JavaScript，xe-utils fork 核心 + moment + axios，单一 UMD）。
