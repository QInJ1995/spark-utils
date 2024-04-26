import staticDecodeURIComponent from '../constant/static/staticDecodeURIComponent'
import arrayEach from '../array/arrayEach'
import isString from '../basic/isString'

/**
 * 反序列化查询参数
 * @param {String} query 字符串
 */
export function unserialize (str) {
	var items
	var result = {}
	if (str && isString(str)) {
		arrayEach(str.split('&'), function (param) {
			items = param.split('=')
			result[staticDecodeURIComponent(items[0])] = staticDecodeURIComponent(items[1] || '')
		})
	}
	return result
}

export default unserialize
