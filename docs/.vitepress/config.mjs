import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "spark-utils",
  description: "同构 JavaScript/TypeScript 工具库（Node 与浏览器通用）",
  lang: 'zh',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '快速上手', link: '/markdown/start' },
      { text: '迁移指南', link: '/markdown/migration' }
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '简介', link: '/markdown/about' },
          { text: '快速上手', link: '/markdown/start' },
          { text: 'v1 → v2 迁移指南', link: '/markdown/migration' }
        ]
      },
      {
        text: '主包 API（spark-utils）',
        items: [
          { text: '基础方法', link: '/markdown/basic' },
          { text: '数组', link: '/markdown/array' },
          { text: '对象', link: '/markdown/object' },
          { text: '函数', link: '/markdown/function' },
          { text: '日期时间', link: '/markdown/date' },
          { text: '数值金额', link: '/markdown/number' },
          { text: '字符串', link: '/markdown/string' },
          { text: '网络请求', link: '/markdown/http' },
          { text: '其他方法', link: '/markdown/other' }
        ]
      },
      {
        text: '子入口 API',
        items: [
          { text: '浏览器工具', link: '/markdown/browser' },
          { text: 'Cookie', link: '/markdown/cookie' },
          { text: 'WebStorage', link: '/markdown/storage' },
          { text: 'DOM', link: '/markdown/dom' },
          { text: '加密', link: '/markdown/crypto' },
          { text: '拼音', link: '/markdown/pinyin' }
        ]
      }
    ],
    socialLinks: [
      // { icon: 'github', link: 'https://github.com/QInJ1995' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/spark-utils' }
    ],
    footer: {
      message: 'Released under the ISC License.',
      copyright: 'Copyright © 2024-present QINJIN'
    },
    outline: {
      label: '页面导航'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})
