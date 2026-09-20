/**
 * 主包体积守门：esbuild 合并 dist/index.js 的模块图后 gzip 计量。
 *
 * 为什么不用逐文件 gzip 求和：preserveModules 产物按单文件 gzip 会重复
 * 压缩各自的 import/export 样板（实测虚高 ~6 倍）；真实消费方体积以
 * 合并压缩后为准。第三方（dayjs/crypto-js/jsrsasign）保持 external 不计。
 *
 * 阈值：主包 ESM gzip < 25KB（不含 dayjs）——2.0 性能目标之一。
 */
import { build } from 'esbuild'
import { existsSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const LIMIT_KB = 25
const ENTRY = 'dist/index.js'

if (!existsSync(ENTRY)) {
  console.error(`[size] 缺少 ${ENTRY}，请先 npm run build`)
  process.exit(1)
}

// esbuild 负责把 preserveModules 模块图拉平成单文件再计量（走内存，不落盘；
// minify+gzip 与消费方生产构建/size-limit 同口径）
const result = await build({
  entryPoints: [ENTRY],
  bundle: true,
  minify: true,
  format: 'esm',
  external: ['dayjs', 'crypto-js', 'jsrsasign'],
  write: false,
  logLevel: 'error',
})

const bundled = result.outputFiles[0].text
const gz = gzipSync(Buffer.from(bundled)).length
const kb = gz / 1024
const ok = kb < LIMIT_KB

console.log(`[size] 主包 ESM（合并 gzip，不含 dayjs/crypto-js/jsrsasign）：${kb.toFixed(1)} KB / 限额 ${LIMIT_KB} KB → ${ok ? '通过' : '超限'}`)
if (!ok) process.exit(1)
