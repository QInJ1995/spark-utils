/**
 * 数组迭代（移植自旧 src/array/arrayEach.js，实现收敛至 internal 层）
 *
 * - 有 forEach 走原生 forEach（context 作为 thisArg 传入）；
 * - 无 forEach 的类数组（如字符串）走索引循环，context 用 .call 绑定；
 * - 回调返回值不参与控制流；falsy 入参静默跳过。
 *
 * 与旧版的差异（M3 登记 override）：旧版恒返回 undefined，
 * 新版返回是否执行了迭代的 boolean。
 */
export { arrayEach } from '../internal/iterate'
