import { map } from './map'

/**
 * 将对象或者伪数组转为新数组（移植自旧 src/array/toArray.js）
 *
 * 经 map 分派：数组走原生 map 返回同元素新数组；对象返回值数组；
 * 字符串逐字符拆分；空入参返回 []。
 *
 * @param list 数组/对象/字符串
 * @returns 新数组
 */
export function toArray<T>(list: readonly T[] | null | undefined): T[]
export function toArray(list: object | string | null | undefined): unknown[]
export function toArray(list: unknown): unknown[] {
  // 断言说明：map 的运行时分派对对象/字符串走 each（值数组/逐字符），此处仅以数组形态过类型检查
  return map(list as readonly unknown[], function toArrayItem(item: unknown): unknown {
    return item
  })
}
