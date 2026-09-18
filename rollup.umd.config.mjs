import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { resolve } from 'node:path'

/**
 * dayjs 的 package.json 只有 main → UMD 产物，rollup 无法 default-import；
 * 仅在此单文件构建内改指其 ESM 版（esm/index.d.ts 自带类型）。
 * 主构建（preserveModules）不受影响：dayjs 保持 external，消费方自行解析。
 */
const dayjsEsmAlias = {
  name: 'dayjs-esm-alias',
  resolveId(source) {
    if (source === 'dayjs') return resolve('node_modules/dayjs/esm/index.js')
    return null
  },
}

/**
 * UMD 单文件构建：存量 <script> 标签用户兼容件。
 * 仅含主包（同构部分）；dayjs 经 node-resolve 实际打入以保持单文件可用
 * （裸导入若无解析插件会被 rollup 默认外置，script 标签场景即断）。
 * 入口取 default 聚合对象 + exports:'default'：全局 SparkUtils 直接就是
 * 平铺方法对象（SparkUtils.debounce(...)），与 1.x 用法一致。
 */
export default {
  input: 'src/default.ts',
  plugins: [
    dayjsEsmAlias,
    nodeResolve(),
    typescript({
      tsconfig: 'tsconfig.src.json',
      compilerOptions: {
        declaration: false,
        emitDeclarationOnly: false,
        composite: false,
        incremental: false,
      },
    }),
    terser({ format: { comments: false } }),
  ],
  output: {
    file: 'dist/spark-utils.min.js',
    format: 'umd',
    name: 'SparkUtils',
    exports: 'default',
  },
}
