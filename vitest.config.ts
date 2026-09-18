import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // M0 阶段尚无用例，随里程碑补齐
    passWithNoTests: true,
    projects: [
      // 注意：inline project 的选项必须嵌套在 test 键下（UserWorkspaceConfig 形状），
      // 平铺会被静默忽略导致每个 project 跑全部文件
      {
        test: {
          testEnvironment: 'node',
          name: 'node',
          include: ['test/node/**/*.spec.ts', 'test/contracts/**/*.spec.ts'],
        },
      },
      {
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
