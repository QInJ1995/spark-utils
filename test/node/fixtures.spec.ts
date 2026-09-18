/**
 * 行为快照对照测试
 *
 * test/fixtures/ 里的每个 JSON 是旧版（v1.1.10）对固定输入的输出快照。
 * test/ported.json 登记已 TS 重写完成的模块与方法，登记后即自动纳入对照。
 * 有意变更的行为登记在 test/overrides.json（跳过并注明理由）。
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalize, revive } from '../../scripts/lib/serialize.mjs'
import { MAPPINGS } from '../mappings'

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const PORTED: Record<string, string[]> = JSON.parse(readFileSync(resolve(ROOT, 'test/ported.json'), 'utf8'))
const OVERRIDES: Record<string, { caseIndexes?: number[]; reason?: string }> = JSON.parse(
  readFileSync(resolve(ROOT, 'test/overrides.json'), 'utf8'),
)

const newModuleCache: Record<string, Record<string, unknown>> = {}

async function loadNewModule(module: string): Promise<Record<string, unknown>> {
  if (!(module in newModuleCache)) {
    // 动态加载新版模块入口（ported 中登记的模块其 src/<module>/index.ts 必然存在）
    newModuleCache[module] = (await import(`../../src/${module}/index.ts`)) as Record<string, unknown>
  }
  return newModuleCache[module]
}

function invokeImpl(fn: unknown, args: unknown[]): unknown {
  const impl = fn as (...a: unknown[]) => unknown
  return impl(...args.map((a) => revive(a)))
}

const portedModules = Object.keys(PORTED).filter((m) => existsSync(resolve(ROOT, `test/fixtures/${m}`)))
const suiteCases: { module: string; method: string; cases: { args: unknown[]; output: unknown; note?: string }[] }[] = []

for (const module of portedModules) {
  const dir = resolve(ROOT, `test/fixtures/${module}`)
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const method = basename(file, '.json')
    if (!PORTED[module]!.includes(method)) continue
    const fixture = JSON.parse(readFileSync(resolve(dir, file), 'utf8'))
    suiteCases.push(fixture)
  }
}

describe('行为快照对照（旧版 v1.1.10 基线）', () => {
  if (suiteCases.length === 0) {
    it.todo('M3 起在 test/ported.json 登记已重写模块，自动纳入对照')
    return
  }

  for (const fixture of suiteCases) {
    const id = `${fixture.module}.${fixture.method}`
    const mapping = MAPPINGS[id]
    const override = OVERRIDES[id]

    describe(id, () => {
      fixture.cases.forEach((caseItem, index) => {
        const label = `[${index}]${caseItem.note ? ` ${caseItem.note}` : ''}`
        if (override?.caseIndexes?.includes(index)) {
          it.skip(`${label}（有意变更：${override.reason ?? '见 overrides.json'}）`, () => {})
          return
        }
        it(label, async () => {
          const entry = await loadNewModule(fixture.module)
          const implName = mapping?.impl ?? fixture.method
          const impl = entry[implName]
          expect(typeof impl, `${id} 在新版 ${fixture.module} 入口中缺失`).toBe('function')
          const args = mapping?.transform ? mapping.transform(caseItem.args) : caseItem.args
          let actual: unknown
          try {
            actual = normalize(invokeImpl(impl, args))
          } catch (error) {
            // 抛错记录与生成器约定同形（顶层 __type:'Throw'），不得再过 normalize（会被当普通对象二次包裹）
            actual = { __type: 'Throw', name: (error as Error)?.name ?? 'Error', message: String((error as Error)?.message ?? error) }
          }
          expect(actual).toEqual(caseItem.output)
        })
      })
    })
  }
})
