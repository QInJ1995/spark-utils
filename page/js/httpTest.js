import Mock from 'mockjs'
Mock.mock(/\.json/, 'get', {
  type: 'get',
  name: '小米',
})
Mock.mock(/\.json/, 'post', {
  type: 'post',
})
SparkUtils.https.init()

const btn =  document.getElementById('btn')
btn.onclick = function() {
  SparkUtils.https.submit({url: 'test.json', method: 'get', autoQs: false,}).then(res => {
    console.log("🚀 ~ SparkUtils.https.submit ~ res:", res)
          
  })
}