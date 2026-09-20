/**
 * 全局配置公共 API（1.x `setup` / `setupDefaults` 的 2.0 形态）
 *
 * - `setup(partial)`：浅合并生成新的深度冻结配置并生效，返回当前配置；
 *   嵌套对象整体替换（不做深合并）且会被一并冻结。
 * - `setupDefaults`：默认配置（深度冻结只读）。
 * - 2.0 变更：旧字段 `axiosConfig` 更名 `httpConfig`；旧可变单例改不可变；
 *   旧 `mixin` 已移除（具名导出 + 自建聚合替代）。
 */
export { setup, setupDefaults } from './internal/config'
export type { SparkUtilsSetup } from './internal/config'
