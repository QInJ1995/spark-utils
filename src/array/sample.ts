import { shuffle } from './shuffle'

/**
 * 从一个数组中随机返回几个元素（移植自旧 src/array/sample.js）
 *
 * - 缺省 number：先完整洗牌再取第一个元素（随机取一）；
 * - 传 number：number 小于洗牌结果长度时截断到 number
 *   （`number || 0`：0 截断为空数组；负数会因 length 赋负值抛 RangeError，旧版一致）。
 *
 * @param array 数组
 * @param number 个数
 * @returns 随机元素（缺省 number）或随机元素数组
 */
export function sample<T>(array: ReadonlyArray<T> | object | string | null | undefined): T | undefined
export function sample<T>(
  array: ReadonlyArray<T> | object | string | null | undefined,
  number: number
): T[]
export function sample(array: unknown, number?: unknown): unknown {
  const result = shuffle(array as unknown[])
  if (arguments.length <= 1) {
    return result[0]
  }
  const count = number as number
  if (count < result.length) {
    result.length = count || 0
  }
  return result
}
