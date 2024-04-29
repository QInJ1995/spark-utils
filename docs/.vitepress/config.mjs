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
      { text: '示例', link: '/markdown/about' }
    ],
    sidebar: [
      {
        text: 'spark-utils',
        items: [
          { text: '简介', link: '/markdown/about' },
          { text: '快速开始', link: '/markdown/start' },
          { text: '基础方法', link: '/markdown/basic' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
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
