import keys from './keys'
import findIndexOf from '../array/findIndexOf'
import isEqual from './isEqual'
import some from '../array/some'
import includeArrays from '../array/includeArrays'

/**
 * 判断属性中的键和值是否包含在对象中
 *
 * @param {Object/Array} obj 对象
 * @param {Object} source 值
 * @return {Boolean}
 */
function isMatch (obj, source) {
  var objKeys = keys(obj)
  var sourceKeys = keys(source)
  if (sourceKeys.length) {
    if (includeArrays(objKeys, sourceKeys)) {
      return some(sourceKeys, function (key2) {
        return findIndexOf(objKeys, function (key1) {
          return key1 === key2 && isEqual(obj[key1], source[key2])
        }) > -1
      })
    }
  } else {
    return true
  }
  return isEqual(obj, source)
}

export default isMatch
