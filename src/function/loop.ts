/**
 * @description: 循环函数
 * @param {*} callback 回调函数
 * @param {*} time 每次循环一次时间 单位 ms
 * @param {*} timeout 超时停止循环 单位 s
 * @return {*}
 */
function loop(callback, time = 500, timeout = 3) {
  if(!callback) {
    console.error('[spark-utils][loop]: 请传入回调函数！')
    return 
  }
  let loopTime = 0
  const timer = setInterval(() => {
    const isStop = callback()
    loopTime += time
    if (isStop || (loopTime > timeout * 1000 )) {
      clearInterval(timer)
    }
  }, time);
}

export default loop