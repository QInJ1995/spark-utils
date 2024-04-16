import helperEqualCompare from '../helpers/helperEqualCompare'
import helperDefaultCompare from '../helpers/helperDefaultCompare'

/**
 * 深度比较两个对象之间的值是否相等
 *
 * @param {Object} obj1 值1
 * @param {Object} obj2 值2
 * @return {Boolean}
 */
function isEqual (obj1, obj2) {
  return helperEqualCompare(obj1, obj2, helperDefaultCompare)
}

export default isEqual
