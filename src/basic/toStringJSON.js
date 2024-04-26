import isPlainObject from './isPlainObject'
import isString from './isString'

/**
  * 字符串转JSON
  *
  * @param {String} str 字符串
  * @return {Object} 返回转换后对象
  */
function toStringJSON (str) {
	if (isPlainObject(str)) {
		return str
	} else if (isString(str)) {
		try {
			return JSON.parse(str)
			// eslint-disable-next-line no-empty
		} catch (e) {}
	}
	return {}
}

export default toStringJSON
