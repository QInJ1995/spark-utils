import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "spark-utils",
  description: "一个丰富、可扩展的JavaScript工具库",
  lang: 'zh',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/markdown/basic' }
    ],
    sidebar: [
      {
        text: 'spark-utils',
        items: [
          { text: '简介', link: '/markdown/about' },
          { text: '快速开始', link: '/markdown/start' },
          { text: '基础方法', link: '/markdown/basic' },
          { text: '数组', link: '/markdown/array' },
          { text: '对象', link: '/markdown/object' },
          { text: 'Function', link: '/markdown/function' },
          { text: '日期处理', link: '/markdown/date' },
          { text: '数据处理', link: '/markdown/number' },
          { text: '字符串处理', link: '/markdown/string' },
          { text: '网络请求', link: '/markdown/https' },
          { text: '浏览器工具', link: '/markdown/browser' },
          { text: '全局配置', link: '/markdown/global' },
          { text: 'WebStorage工具', link: '/markdown/storage' },
          { text: 'Cookie操作', link: '/markdown/cookie' },
          { text: 'DOM元素信息', link: '/markdown/dom' },
          { text: '加密工具', link: '/markdown/crypto' },
          { text: '其他方法', link: '/markdown/other' },
          // { text: 'Markdown Examples', link: '/markdown-examples' },
          // { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    socialLinks: [
      // { icon: 'github', link: 'https://github.com/QInJ1995' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/spark-utils' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present QINJIN'
    },
    outline: {
      label: '页面导航'
    },
  }
})
