/* eslint-disable valid-typeof */
import staticStrUndefined from '../constant/static/staticStrUndefined'

/**
  * 判断是否Set对象
  *
  * @param {Object} obj 对象
  * @return {Boolean}
 */
var supportSet = typeof Set !== staticStrUndefined
function isSet (obj) {
	return supportSet && obj instanceof Set
}

export default isSet
