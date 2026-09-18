import typescript from '@rollup/plugin-typescript'

/**
 * 主构建：preserveModules 多入口，产出 ESM + CJS 双格式。
 *
 * 所有入口（主包 + browser + crypto + pinyin）必须在**同一次构建**里emit：
 * preserveModules 下共享模块（src/internal/*）只落盘一份，若分多次构建
 * 写同一 dist，后写的会用「本入口裁剪过的导出」覆盖完整版（曾导致
 * guards.js 丢失 isNumber 等，主入口运行时拿到 undefined）。
 * rollup 在单次构建中对导出取「全部入口的并集」，不会误裁。
 *
 * 类型检查不依赖本构建：tsc -b（tsconfig.src/browser/test）已按各自
 * 严格度把关；此处统一用带 DOM lib 的宽松 tsconfig 仅作转换。
 * 第三方依赖（dayjs/crypto-js/jsrsasign）全部 external，不打进产物。
 */

const ENTRIES = [
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
  'src/browser.ts',
  'src/crypto.ts',
]

const EXTERNAL = [/^dayjs/, /^crypto-js/, /^jsrsasign/, /^node:/]

export default {
  input: ENTRIES,
  external: EXTERNAL,
  plugins: [typescript({ tsconfig: 'tsconfig.rollup.json' })],
  output: [
    { dir: 'dist', format: 'es', preserveModules: true, entryFileNames: '[name].js' },
    { dir: 'dist', format: 'cjs', preserveModules: true, entryFileNames: '[name].cjs' },
  ],
}
