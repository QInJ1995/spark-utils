const btn =  document.getElementById('btn')
btn.onclick = function() {
  SparkUtils.log.info('测试测试')
  SparkUtils.log.info({a:{b:{c:1,},}, m: 123,})
  SparkUtils.log.info([{}])
  SparkUtils.log.table({a:{b:{c:1,},}, m: 123,})
  SparkUtils.log.image('https://img2.baidu.com/it/u=2814429148,2262424695&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1730998800&t=e60940f39f2a1e0cf5e65c6df7b0227a', 0.1)
} 
