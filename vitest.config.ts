import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // M0 阶段尚无用例，随里程碑补齐
    passWithNoTests: true,
    projects: [
      {
        testEnvironment: 'node',
        include: ['test/node/**/*.spec.ts'],
      },
      {
        testEnvironment: 'jsdom',
        include: ['test/jsdom/**/*.spec.ts'],
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/sm-vendor/**', 'src/types/**'],
    },
  },
})
