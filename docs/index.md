---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "spark-utils"
  text: "同构 JavaScript / TypeScript 工具库"
  tagline: TypeScript 严格重写 · 具名导出 · Node 与浏览器通用 · 按子入口分包
  image:
    src: ./image/logo.png
    alt: spark-utils
  actions:
    - theme: brand
      text: 快速上手
      link: /markdown/start
    - theme: alt
      text: v1 → v2 迁移指南
      link: /markdown/migration
    - theme: alt
      text: 简介
      link: /markdown/about

features:
  - icon: 📘
    title: TypeScript 原生
    details: 2.0 全量 TS 严格模式重写，具名导出 + 完整类型提示，导入即得参数与返回值类型。
  - icon: 🌗
    title: Node / 浏览器同构
    details: 主包在 Node 下可安全 import（零 DOM 触碰）；浏览器能力经 spark-utils/browser 子入口按需引入。
  - icon: 📦
    title: 子入口分包
    details: browser / crypto / pinyin 独立子入口，crypto-js、jsrsasign、拼音字典不拖累主包体积，对打包器摇树友好。
  - icon: 🛡️
    title: 安全重设计
    details: crossDomain 移除 eval 改白名单注册，http 换原生 fetch，crypto 错误统一抛 CryptoError，clipboard 走异步 Clipboard API。
  - icon: 📅
    title: dayjs 日期引擎
    details: moment 全弃，dateToString 改用 dayjs（token 一致），dateDiff + getDateDiff 合并为一个 API。
  - icon: 🚀
    title: UMD 保留
    details: dist/spark-utils.min.js UMD 产线可用（dayjs 已打入），script 标签直引亦可得 SparkUtils 全局对象。
---
