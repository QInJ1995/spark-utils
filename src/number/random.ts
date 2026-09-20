/**
 * 获取一个指定范围内随机数（移植自旧 src/number/random.js）
 *
 * - minVal >= maxVal 时原样返回 minVal；
 * - minVal 先 `>> 0` 截断为 32 位整数（右操作数读取的是截断后的值，忠实旧版）；
 * - maxVal 缺省按 9 处理，返回 [minVal, maxVal]（或 9）内的四舍五入整数。
 *
 * 基于 Math.random，结果不确定，不纳入行为快照（快照基线排除本方法）。
 */

/** 获取一个指定范围内随机数 */
export function random(minVal: number, maxVal?: number): number {
  // 旧实现为 minVal >= maxVal（maxVal 为 undefined 时数值比较为 false，走随机分支）
  if (maxVal !== undefined && minVal >= maxVal) {
    return minVal
  }
  const base = minVal >> 0
  return base + Math.round(Math.random() * ((maxVal || 9) - base))
}
