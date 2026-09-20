/**
 * 迭代器（公共出口）
 *
 * 实现位于 ../internal/iterate（数组走原生 forEach，其余走 for-in + hasOwnProp；
 * 回调返回值不参与控制流；truthy 入参遍历后返回 undefined，falsy 入参原样返回）。
 */

/** 迭代器：数组与对象通用遍历 */
export { each } from '../internal/iterate'
