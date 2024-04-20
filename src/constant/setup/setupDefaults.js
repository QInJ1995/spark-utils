'use strict'

var formatString = 'yyyy-MM-dd HH:mm:ss'
var setupDefaults = {
  promiseResultConfig: {
    resultKey: 'data', // 结果数据key
    verifyConfig: {}, // 验证配置
  },
  treeOptions: {
    parentKey: 'parentId',
    key: 'id',
    children: 'children'
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
  ]
}

export default setupDefaults
