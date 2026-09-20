/**
 * 循环函数（移植自旧 src/function/loop.js）
 *
 * 忠实旧语义：
 * - 每 time 毫秒执行一次 callback，返回值真值时停止循环；
 * - 累计执行时长超过 timeout 秒（注意单位为秒）后强制停止；
 * - 不传回调时 console.error 提示并直接返回。
 */

/**
 * 循环函数
 *
 * @param callback 回调函数（返回真值停止循环）
 * @param time 每次循环间隔，单位 ms，默认 500
 * @param timeout 超时停止循环，单位 s，默认 3
 */
export function loop(callback: (() => unknown) | null | undefined, time = 500, timeout = 3): void {
  if (!callback) {
    console.error('[spark-utils][loop]: 请传入回调函数！')
    return
  }
  let loopTime = 0
  const timer = setInterval(() => {
    const isStop = callback()
    loopTime += time
    if (isStop || loopTime > timeout * 1000) {
      clearInterval(timer)
    }
  }, time)
}
