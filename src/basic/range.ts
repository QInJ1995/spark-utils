/**
 * 序号列表生成函数（旧 src/basic/range.js）
 *
 * 怪癖忠实保留（fixture 锁定）：
 * - args.length < 2 时首参即 stop、start 归 0（range(5) => [0..4]）；
 * - start/stop/step 均经 >>0 截断（range(3.7) => [0,1,2]）；
 * - 进入循环的判据是 index < stop（原始值）而非截断后的 len；
 * - 步长经 >>0 截断后为 0/NaN 时回退 1。
 */

/**
 * 序号列表生成函数
 *
 * @param stop 结束值（单参形态）
 * @returns 含头不含尾的序号数组
 */
export function range(stop: number): number[]
/**
 * 序号列表生成函数
 *
 * @param start 起始值
 * @param stop 结束值
 * @param step 自增值
 * @returns 含头不含尾的序号数组
 */
export function range(start: number, stop: number, step?: number): number[]
export function range(...args: readonly (number | undefined)[]): number[] {
  let start: number | undefined = args[0]
  let stop: number | undefined = args[1]
  const step: number | undefined = args[2]
  if (args.length < 2) {
    stop = start
    start = 0
  }
  const result: number[] = []
  let index = (start as number) >> 0
  const len = (stop as number) >> 0
  if (index < (stop as number)) {
    const inc = (step as number) >> 0 || 1
    for (; index < len; index += inc) {
      result.push(index)
    }
  }
  return result
}
