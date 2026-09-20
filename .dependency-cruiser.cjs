/** 依赖规则：internal 分层 + 主包域禁止横向互引（旧代码 .js 已排除，只约束新 TS） */

const CORE_MODULES = ['basic', 'array', 'object', 'function', 'number', 'string', 'date', 'log', 'other', 'http']
const INTERNAL_L0 = ['type', 'number', 'string', 'paths', 'datetime', 'env', 'config']
const INTERNAL_L1 = ['iterate']
const INTERNAL_L2 = ['compare', 'tree']
const SUBENTRIES = ['browser', 'crypto']

const pathOf = (mod) => `^src/internal/${mod}(/|\\.ts$)`
const higherLayers = [...INTERNAL_L1, ...INTERNAL_L2].map(pathOf).join('|')

/** 主包域模块之间禁止横向互引（只准向下引 internal） */
const noLateralImports = []
for (const from of CORE_MODULES) {
  const others = CORE_MODULES.filter((m) => m !== from).map((m) => `^src/${m}/`).join('|')
  noLateralImports.push({
    name: `no-lateral-${from}`,
    severity: 'error',
    comment: `${from} 模块禁止横向引用其他主包域模块（只准引 internal）`,
    from: { path: `^src/${from}/` },
    to: { path: others },
  })
}

/** internal L0 层禁止向上引 L1/L2 */
const noUpwardFromL0 = INTERNAL_L0.map((mod) => ({
  name: `internal-${mod}-stays-l0`,
  severity: 'error',
  comment: `internal/${mod} 是 L0 层，禁止引用 iterate/compare/tree`,
  from: { path: pathOf(mod) },
  to: { path: higherLayers },
}))

/** internal L1 禁止引 L2 */
const noUpwardFromL1 = INTERNAL_L1.map((mod) => ({
  name: `internal-${mod}-stays-l1`,
  severity: 'error',
  comment: `internal/${mod} 是 L1 层，禁止引用 compare/tree`,
  from: { path: pathOf(mod) },
  to: { path: INTERNAL_L2.map(pathOf).join('|') },
}))

/** 子入口域彼此隔离 */
const subentryIsolation = []
for (const from of SUBENTRIES) {
  const others = SUBENTRIES.filter((m) => m !== from).map((m) => `^src/${m}(/|\\.ts$)`).join('|')
  subentryIsolation.push({
    name: `${from}-isolated`,
    severity: 'error',
    comment: `${from} 子入口域禁止引用其他子入口域`,
    from: { path: `^src/${from}(/|\\.ts$)` },
    to: { path: others },
  })
}

module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: '禁止循环依赖（旧库 basic↔array↔object 三角环是重写要解决的核心问题）',
      from: {},
      to: { circular: true },
    },
    {
      name: 'core-not-import-subentry',
      severity: 'error',
      comment: '主包（同构）禁止引用 browser/crypto 子入口域',
      from: {
        path: '^src/(basic|array|object|function|number|string|date|log|other|http|internal|types)',
      },
      to: { path: '^src/(browser|crypto)(/|\\.ts$)' },
    },
    ...noLateralImports,
    ...noUpwardFromL0,
    ...noUpwardFromL1,
    ...subentryIsolation,
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    // 旧 .js 文件逐模块删除中（M3-M6），分层规则只约束新 TS 代码
    exclude: ['\\.js$'],
    tsConfig: { fileName: 'tsconfig.src.json' },
    enhancedResolveOptions: { exportsFields: ['exports'], conditionNames: ['import', 'types'] },
  },
}
