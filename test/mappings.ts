/**
 * 合并方法的快照映射：旧方法名 → 新实现名 + 参数变换。
 * 对应计划中的 API 合并组（dateDiff/getDateDiff 等）。
 */
export const MAPPINGS: Record<string, { impl: string; transform?: (args: unknown[]) => unknown[] }> = {
  // date.getDateDiff(start, end, rules) → 新 dateDiff(start, end, { detailed: true, rules? })
  'date.getDateDiff': {
    impl: 'dateDiff',
    transform: (args) => [args[0], args[1], { detailed: true, ...(args[2] !== undefined ? { rules: args[2] } : {}) }],
  },
}
