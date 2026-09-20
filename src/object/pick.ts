/**
 * 根据 key 过滤指定的属性值，返回一个新的对象（移植自旧 src/object/pick.js）
 *
 * 旧版经 helperCreatePickOmit(1, 0) 工厂生成：
 * - 第一参为函数时按 (value, key, obj) 调用做筛选（this 取调用时的上下文）；
 * - 否则把从第一参起的所有参数（数组展平）作为键名列表，命中即保留；
 * - falsy 入参返回 {}（不匹配的键被丢弃）。
 *
 * 2.0 去重：实现收敛至本域内部模块 helperCreatePickOmit（与 omit 共享）。
 */
import { helperCreatePickOmit } from './helperCreatePickOmit'

export type { PickOmitCallback } from './helperCreatePickOmit'

/** 根据 key 过滤指定的属性值，返回一个新的对象（命中即保留） */
export const pick = helperCreatePickOmit(true)
