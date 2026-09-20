/**
 * 导出面契约测试：各入口的具名导出集合锁定在 test/contracts/exports-snapshot.json。
 * 增删导出必须显式更新快照（UPDATE_SNAPSHOTS=1 npx vitest run test/contracts），并在 commit 中说明。
 *
 * 在 node 环境导入全部入口（含 browser）本身即是一道同构冒烟：import 期触 DOM 会直接失败。
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const SNAPSHOT_FILE = resolve(ROOT, 'test/contracts/exports-snapshot.json')

/** 入口 → 源文件（与 package.json exports 对应；UMD 走独立构建不含在此） */
const ENTRIES: Record<string, string> = {
  '.': '../../src/index.ts',
  './browser': '../../src/browser.ts',
  './crypto': '../../src/crypto.ts',
  './pinyin': '../../src/pinyin.ts',
}

const UPDATING = process.env.UPDATE_SNAPSHOTS === '1'

async function loadEntryNames(specifier: string): Promise<string[]> {
  const mod = (await import(specifier)) as Record<string, unknown>
  return Object.keys(mod).sort()
}

async function collectAll(): Promise<Record<string, string[]>> {
  const out: Record<string, string[]> = {}
  for (const [entry, specifier] of Object.entries(ENTRIES)) {
    out[entry] = await loadEntryNames(specifier)
  }
  return out
}

describe('入口导出面契约', () => {
  it('各入口导出名与快照一致', async () => {
    const actual = await collectAll()
    if (UPDATING || !existsSync(SNAPSHOT_FILE)) {
      writeFileSync(SNAPSHOT_FILE, JSON.stringify(actual, null, 2) + '\n')
      console.warn(`[contracts] 已${UPDATING ? '重新生成' : '初始化'}快照 ${SNAPSHOT_FILE}，请在 commit 中审查 diff`)
      return
    }
    const expected: Record<string, string[]> = JSON.parse(readFileSync(SNAPSHOT_FILE, 'utf8'))
    expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort())
    for (const entry of Object.keys(expected)) {
      expect(actual[entry], `入口 ${entry} 导出面有增删（更新快照请在 commit 说明）`).toEqual(expected[entry])
    }
  })
})
