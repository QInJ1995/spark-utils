# sm-vendor（vendored 国密实现）

收编自旧 `src/crypto/sm/crypto/`（1.x 起随包分发的第三方实现，无上游仓库可追踪），
仅有的三个加工：

1. **同构守卫补丁**（仅 `sm2-1.0.js`，共 6 处，前缀 `__su_nav` / `__su_win`）：
   原实现在模块加载期裸访问 `window` / `navigator`（jsbn 分支选择、IIFE 实参、
   `window.SM2Utils` 挂载），纯 Node 下 import 即抛 ReferenceError。补丁以
   `typeof` 探测垫片替代：navigator 缺省时 `appName: 'Netscape'`（与现代浏览器
   同走 am3 / dbits 28 分支，保证与浏览器端一致的 BigInteger 行为），window
   缺省时回落 `globalThis`。浏览器行为完全不变。
2. **eval 消除补丁**（仅 `sm2-1.0.js`，2 处调用 + 1 个助手 `__su_path_lookup`）：
   内嵌 jsrsasign 片段在 `KJUR.crypto.MessageDigest` / `KJUR.crypto.Mac` 的
   cryptojs provider 分支里以 `eval('CryptoJS.algo.MD5')` 形式的点路径字符串
   按名取摘要算法。替换为显式路径求值助手（从模块顶层 `import CryptoJS`
   绑定出发逐段取值），行为等价，消除 rollup 的 use-of-eval 告警与 CSP 隐患。
3. **ext/ 未收编**：旧树 `ext/`（rng.js/jsbn.js 独立副本）无任何引用方
   （sm2-1.0.js 为自含 bundle，jsbn 已内联），属死代码，未复制。

其余文件与旧树逐字节一致（`diff -r` 校验过，见 M6 集成提交）。

## 已知事实

- **SM4 与 GB/T 32907 标准向量不一致**（实测标准 ECB 单块向量得 `d50346…` 而非
  `681edf…`）；线上存量密文即由此实现产生，故原样保留，测试 KAT 为实现锁定值。
  SM3 / MD5 / AES 均与标准一致。
- `sm2-1.0.js` 顶层 `import CryptoJS from 'crypto-js'`：rollup 侧 external，
  与主程序共用同一依赖。
- 模块加载会向宿主全局挂载 `SM2` / `SM2Utils`（沿用旧行为；node 下落在
  `globalThis`）。

## 类型

各入口的手写 `.d.ts` 为最小结构类型（仅覆盖 wrapper 实际用到的面）；
`vendor-libs.d.ts` 是 vendor 程序内 crypto-js/jsrsasign 的最小垫片声明。
`tsconfig.sm-vendor.json`：strict:false / allowJs / checkJs:false / noEmit，
独立于人工程序的严格 tsconfig 体系。
