import typescript from '@rollup/plugin-typescript'

/**
 * 主构建：preserveModules 多入口，产出 ESM + CJS 双格式。
 * - 主包（同构）：tsconfig.src.json（无 DOM lib，编译期拦截 window 泄漏）
 * - browser / crypto 子入口：tsconfig.browser.json（带 DOM lib）
 * 第三方依赖（dayjs/crypto-js/jsrsasign）全部 external，不打进产物。
 */

const MAIN_ENTRIES = [
  'src/index.ts',
  'src/basic/index.ts',
  // 随里程碑逐步加入：
  // 'src/array/index.ts', 'src/object/index.ts',
  // 'src/function/index.ts', 'src/number/index.ts', 'src/string/index.ts',
  // 'src/date/index.ts', 'src/log/index.ts', 'src/other/index.ts', 'src/http/index.ts',
  'src/pinyin.ts',
]

const BROWSER_ENTRIES = ['src/browser.ts']
const CRYPTO_ENTRIES = ['src/crypto.ts']

const EXTERNAL = [/^dayjs/, /^crypto-js/, /^jsrsasign/, /^node:/]

const pluginOverrides = {
  declaration: false,
  emitDeclarationOnly: false,
  composite: false,
  incremental: false,
}

export default [
  {
    input: MAIN_ENTRIES,
    external: EXTERNAL,
    plugins: [typescript({ tsconfig: 'tsconfig.src.json', compilerOptions: pluginOverrides })],
    output: [
      { dir: 'dist', format: 'es', preserveModules: true, entryFileNames: '[name].js' },
      { dir: 'dist', format: 'cjs', preserveModules: true, entryFileNames: '[name].cjs' },
    ],
  },
  {
    input: BROWSER_ENTRIES,
    external: EXTERNAL,
    plugins: [typescript({ tsconfig: 'tsconfig.browser.json', compilerOptions: pluginOverrides })],
    output: [
      { dir: 'dist', format: 'es', preserveModules: true, entryFileNames: '[name].js' },
      { dir: 'dist', format: 'cjs', preserveModules: true, entryFileNames: '[name].cjs' },
    ],
  },
  {
    input: CRYPTO_ENTRIES,
    external: EXTERNAL,
    plugins: [typescript({ tsconfig: 'tsconfig.browser.json', compilerOptions: pluginOverrides })],
    output: [
      { dir: 'dist', format: 'es', preserveModules: true, entryFileNames: '[name].js' },
      { dir: 'dist', format: 'cjs', preserveModules: true, entryFileNames: '[name].cjs' },
    ],
  },
]
