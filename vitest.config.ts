import { defineConfig } from 'vitest/config'

export default defineConfig({
  // .ts 优先解析：M3-M6 期间新旧文件并存（旧 .js 链引用已删除的模块，不可加载），
  // vite 默认 .js 优先会让无后缀导入命中死链；全部旧 .js 消化后此配置为无害冗余
  resolve: {
    extensions: ['.ts', '.tsx', '.mts', '.js', '.mjs', '.cjs', '.jsx', '.json'],
  },
  test: {
    // M0 阶段尚无用例，随里程碑补齐
    passWithNoTests: true,
    projects: [
      // 注意：inline project 的选项必须嵌套在 test 键下（UserWorkspaceConfig 形状），
      // 平铺会被静默忽略导致每个 project 跑全部文件；
      // extends: true 继承根级 resolve（.ts 优先解析）等 vite 选项
      {
        extends: true,
        test: {
          testEnvironment: 'node',
          name: 'node',
          include: ['test/node/**/*.spec.ts', 'test/contracts/**/*.spec.ts'],
        },
      },
      {
        extends: true,
        test: {
          testEnvironment: 'jsdom',
          name: 'jsdom',
          include: ['test/jsdom/**/*.spec.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/sm-vendor/**', 'src/types/**'],
    },
  },
})
