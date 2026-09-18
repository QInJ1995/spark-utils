/**
 * 数组倒序迭代（移植自旧 src/array/lastArrayEach.js，实现收敛至 internal 层）
 *
 * 忠实旧实现：不做空值保护，null/undefined 直接读取 length 抛 TypeError
 * （test/fixtures/array/lastArrayEach.json 锁定该行为）。
 *
 * 与旧版的差异（M3 登记 override）：旧版恒返回 undefined，新版返回 true。
 */
export { lastArrayEach } from '../internal/iterate'
