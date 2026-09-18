import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

/**
 * UMD 单文件构建：存量 <script> 标签用户兼容件。
 * 仅含主包（同构部分），dayjs 在用到时直接打入以保持单文件可用。
 * TODO(M7): default 聚合对象落地后设置 exports: 'default'，维持旧版 SparkUtils.xxx 平铺用法。
 */
export default {
  input: 'src/index.ts',
  plugins: [
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
  },
}
