/** 依赖规则：分层约束在 M2/M3 各层落地后逐步收紧 */
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
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    // 旧 .js 文件逐模块删除中（M3-M6），分层规则只约束新 TS 代码
    exclude: ['\\.js$'],
    tsConfig: { fileName: 'tsconfig.src.json' },
    enhancedResolveOptions: { exportsFields: ['exports'], conditionNames: ['import', 'types'] },
  },
}
