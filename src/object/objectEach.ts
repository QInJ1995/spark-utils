/**
 * 对象迭代（旧 src/object/objectEach.js，2.0 直接复用 internal 层实现）
 *
 * 语义与旧版一致：for-in + hasOwnProp 只遍历自有键，context 用 .call 绑定，
 * 回调返回值不参与控制流，falsy 入参静默跳过，返回 undefined。
 */
export { objectEach } from '../internal/iterate'
