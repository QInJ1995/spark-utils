import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "spark-utils",
  description: "一个丰富、可扩展的JavaScript工具库",
  lang: 'zh-Hans',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      // { icon: 'github', link: 'https://github.com/QInJ1995' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/spark-utils' }
    ]
  }
})
