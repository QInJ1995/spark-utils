/**
 * 将一个数组随机打乱，返回一个新的数组（移植自旧 src/array/shuffle.js）
 *
 * Fisher-Yates 式无放回抽样：从尾部往前，每轮从剩余区间随机取一位
 * （旧 number/random(0, len) 的内联：Math.round(Math.random() * len)），
 * 追加到结果后从剩余列表移除；返回新数组，不改入参。
 * 入参经旧 values（Object.values）取值，空入参返回 []。
 *
 * @param array 数组（旧版经 values 兼容对象/字符串）
 * @returns 随机打乱后的新数组
 */
export function shuffle<T>(array: ReadonlyArray<T> | object | string | null | undefined): T[] {
  const result: T[] = []
  // 旧 basic/values.js：Object.values 可用即 Object.values，假值入参返回 []
  const list: unknown[] = array ? Object.values(array as object) : []
  for (let len = list.length - 1; len >= 0; len--) {
    const index = len > 0 ? Math.round(Math.random() * len) : 0
    result.push(list[index] as T)
    list.splice(index, 1)
  }
  return result
}
