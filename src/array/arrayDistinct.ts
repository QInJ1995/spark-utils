/**
 * 数组去重（按引用保持首个出现项）（移植自旧 src/array/arrayDistinct.js）
 *
 * - 以 Map 键判重（SameValueZero：数字 1 与字符串 '1' 区分）；
 * - 对象项按 property 属性值判重，保留首个；
 *   属性值为 falsy（0/''/null/undefined/false）时回退按项本身判重（怪癖忠实保留）；
 * - 无空值保护：null/undefined 直接读 reduce 抛 TypeError（fixture 锁定）。
 *
 * @param array 对象数组或者普通数组
 * @param property 对象属性（对象数组必填）
 * @returns 去重后的新数组
 */
export function arrayDistinct<T>(array: ReadonlyArray<T>, property?: string): T[] {
  const list = array as unknown[]
  const distinct = list.reduce(function collectDistinct(pre: Map<unknown, unknown>, cur: unknown) {
    const obj = cur as { [key: string]: unknown }
    const value = cur instanceof Object && obj[property as string] ? obj[property as string] : cur
    if (!pre.has(value)) {
      pre.set(value, cur)
    }
    return pre
  }, new Map<unknown, unknown>())
  return Array.from(distinct.values()) as T[]
}
