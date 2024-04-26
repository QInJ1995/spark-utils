'use strict'

var formatString = 'yyyy-MM-dd HH:mm:ss'
var setupDefaults = {
  axiosConfig: {
    baseURL: '', // 设置默认的请求地址
    timeout: 10000, // 设置超时时间
    headers: {
      'Content-Type': 'application/json', // 设置默认的 Content-Type
    },
  },
  promiseResultConfig: {
    resultKey: 'data', // 结果数据key
    verifyConfig: {}, // 验证配置
  },
  treeOptions: {
    parentKey: 'parentId',
    key: 'id',
    children: 'children',
  },
  formatDate: formatString + '.SSSZ',
  formatString: formatString,
  dateDiffRules: [
    ['yyyy', 31536000000],
    ['MM', 2592000000],
    ['dd', 86400000],
    ['HH', 3600000],
    ['mm', 60000],
    ['ss', 1000],
    ['S', 0]
  ],
}

export default setupDefaults
