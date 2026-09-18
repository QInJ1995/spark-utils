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
  'src/array/index.ts',
  'src/number/index.ts',
  'src/string/index.ts',
  'src/object/index.ts',
  'src/function/index.ts',
  'src/log/index.ts',
  'src/http/index.ts',
  'src/other/index.ts',
  'src/date/index.ts',
  'src/pinyin.ts',
]

const BROWSER_ENTRIES = ['src/browser.ts']
const CRYPTO_ENTRIES = ['src/crypto.ts']

/**
 * browser/crypto 域的 rollup 构建用专属 tsconfig：其 include 必须覆盖
 * 域文件 + 它们引用的 src/internal（tsconfig.browser.json 仅含域文件，
 * 供 tsc -b 经 project references 做类型检查；rollup 的 typescript 插件
 * 只转换 include 内的文件，裸 .ts 会以 JS 解析报错）。
 */
const DOM_TSCONFIG = 'tsconfig.rollup-dom.json'

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
    plugins: [typescript({ tsconfig: DOM_TSCONFIG, compilerOptions: pluginOverrides })],
    output: [
      { dir: 'dist', format: 'es', preserveModules: true, entryFileNames: '[name].js' },
      { dir: 'dist', format: 'cjs', preserveModules: true, entryFileNames: '[name].cjs' },
    ],
  },
  {
    input: CRYPTO_ENTRIES,
    external: EXTERNAL,
    plugins: [typescript({ tsconfig: DOM_TSCONFIG, compilerOptions: pluginOverrides })],
    output: [
      { dir: 'dist', format: 'es', preserveModules: true, entryFileNames: '[name].js' },
      { dir: 'dist', format: 'cjs', preserveModules: true, entryFileNames: '[name].cjs' },
    ],
  },
]
