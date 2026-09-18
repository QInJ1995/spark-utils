/**
 * 对象倒序迭代（旧 src/object/lastObjectEach.js，2.0 直接复用 internal 层实现）
 *
 * 语义与旧版一致：keys(obj)（null → []，不抛错）后倒序遍历，
 * context 用 .call 绑定，回调返回值不参与控制流，返回 undefined。
 */
export { lastObjectEach } from '../internal/iterate'
