/**
 * 迭代器，从最后开始迭代（公共出口）
 *
 * 实现位于 ../internal/iterate（数组倒序索引循环，对象按 keys 倒序；
 * truthy 入参遍历后返回 undefined，falsy 入参原样返回）。
 */

/** 迭代器，从最后开始迭代 */
export { lastEach } from '../internal/iterate'
