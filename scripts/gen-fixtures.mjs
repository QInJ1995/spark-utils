/**
 * 行为快照生成器：调用旧版（v1.1.10）SparkUtils，把每个保留方法的样例输入/输出
 * 规范化后写入 test/fixtures/，作为 2.0 TS 重写的行为基准。
 *
 * 运行方式（旧代码为 webpack 风格无扩展名导入，需走 vite 解析管线）：
 *   npx vite-node scripts/gen-fixtures.mjs
 */
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalize, deepClone } from './lib/serialize.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CASES_DIR = resolve(ROOT, 'test/fixtures-cases')
const OUT_DIR = resolve(ROOT, 'test/fixtures')

/** 时间相关（依赖当前时刻）与计数器类方法，无法用固定输入快照，排除 */
const NON_DETERMINISTIC = new Set([
  'number.random',
  'array.shuffle', 'array.sample',
  'string.uuid',
  'basic.uniqueId',
  'date.now', 'date.timestamp',
  'date.getCurDate', 'date.getCurDateMonth', 'date.getCurDateTime', 'date.getCurDateFullTime',
  'date.getCurQuarter', 'date.getCurIssue', 'date.getCurDateYear',
  'function.delay', 'function.throttle', 'function.debounce', 'function.loop',
  // 包装函数经 vite 转换后 src 带环境痕迹，无法稳定序列化（M3 用属性测试覆盖）
  'function.once', 'function.after', 'function.before',
  'basic.property',
])

/** 已确定删除/迁移的方法，不生成快照（API 破坏面见 MIGRATION 计划） */
const REMOVED = new Set([
  // 纯原生镜像
  'basic.keys', 'basic.values', 'basic.entries',
  'array.slice', 'array.indexOf', 'array.arrayIndexOf', 'array.lastIndexOf', 'array.arrayLastIndexOf',
  'array.includes', 'array.copyWithin',
  'string.trim', 'string.trimLeft', 'string.trimRight', 'string.repeat',
  'string.padStart', 'string.padEnd', 'string.startsWith', 'string.endsWith',
  // moment 桥接（迁移 dayjs 原生写法）
  'date.moment', 'date.getMoment', 'date.stringToMoment', 'date.stringArrayToMomentArray',
  'date.momentToString', 'date.momentArrayToStringArray', 'date.dateToMoment', 'date.momentToDate',
  // 其他删除项
  'other.onMountDialog', 'function.bind', 'number.commafy', 'array.invoke',
])

/** 调用一个方法并规范化结果（抛错也作为行为记录） */
function invoke(fn, args) {
  try {
    return { output: normalize(fn(...args.map(deepClone))) }
  } catch (error) {
    return { output: { __type: 'Throw', name: error?.name ?? 'Error', message: String(error?.message ?? error) } }
  }
}

async function main() {
  const legacy = (await import(resolve(ROOT, 'src/index.js'))).default

  const report = {}
  mkdirSync(OUT_DIR, { recursive: true })

  for (const file of readdirSync(CASES_DIR).filter((f) => f.endsWith('.mjs'))) {
    const { module, methods } = (await import(resolve(CASES_DIR, file))).default
    for (const [method, cases] of Object.entries(methods)) {
      const id = `${module}.${method}`
      if (REMOVED.has(id) || NON_DETERMINISTIC.has(id)) continue
      const fn = legacy[method]
      if (typeof fn !== 'function') {
        report[id] = { status: 'missing-in-legacy', note: '旧库无此方法（检查方法名）' }
        continue
      }
      const results = []
      let nondet = false
      for (const c of cases) {
        const first = invoke(fn, c.args)
        const second = invoke(fn, c.args)
        if (JSON.stringify(first) !== JSON.stringify(second)) {
          nondet = true
          break
        }
        results.push({ args: c.args.map((arg) => normalize(arg)), ...first, note: c.note })
      }
      if (nondet) {
        report[id] = { status: 'nondeterministic', note: '双调用结果不一致，需改用属性测试' }
        continue
      }
      const dir = resolve(OUT_DIR, module)
      mkdirSync(dir, { recursive: true })
      writeFileSync(resolve(dir, `${method}.json`), JSON.stringify({ module, method, cases: results }, null, 2) + '\n')
      report[id] = { status: 'ok', cases: results.length }
    }
  }

  writeFileSync(resolve(OUT_DIR, '_report.json'), JSON.stringify(report, null, 2) + '\n')
  const counts = Object.values(report).reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1
    return acc
  }, {})
  console.log('生成完成:', counts)
  const problem = Object.entries(report).filter(([, r]) => r.status !== 'ok')
  if (problem.length) console.log('问题项:\n' + problem.map(([k, r]) => `  ${k}: ${r.status} ${r.note ?? ''}`).join('\n'))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
