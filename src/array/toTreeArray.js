import setupDefaults from '../constant/setup/setupDefaults'
import each from '../basic/each'
import assign from '../object/assign'

function unTreeList (result, array, opts) {
  var optChildren = opts.children
  var optData = opts.data
  var optClear = opts.clear
  each(array, function (item) {
    var children = item[optChildren]
    if (optData) {
      item = item[optData]
    }
    result.push(item)
    if (children && children.length) {
      unTreeList(result, children, opts)
    }
    if (optClear) {
      delete item[optChildren]
    }
  })
  return result
}

/**
  * 将一个树结构转成数组列表
  *
  * @param {Array} array 数组
  * @param {Object} options { children: 'children', data: 'data', clear: false }
  * @return {Array}
  */
function toTreeArray (array, options) {
  return unTreeList([], array, assign({}, setupDefaults.treeOptions, options))
}

export default toTreeArray
