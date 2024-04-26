/**
 * @category URL处理
 * @module serializer
 */
import staticEncodeURIComponent from '../constant/static/staticEncodeURIComponent';
import each from '../basic/each';
import isArray from '../basic/isArray';
import isNull from '../basic/isNull';
import isUndefined from '../basic/isUndefined';
import isPlainObject from '../basic/isPlainObject';
/**
 *
 * @param resultVal
 * @param resultKey
 * @param isArr
 */
// eslint-disable-next-line no-unused-vars
function stringifyParams(resultVal, resultKey, isArr) {
	let _arr;
	let result = [];
	each(resultVal, function (item, key) {
		_arr = isArray(item);
		if (isPlainObject(item) || _arr) {
			result = result.concat(stringifyParams(item, resultKey + '[' + key + ']', _arr));
		}
		else {
			result.push(staticEncodeURIComponent(resultKey + '[' + key + ']') + '=' + staticEncodeURIComponent(isNull(item) ? '' : item));
		}
	});
	return result;
}
/**
 * 序列化查询参数
 *
 * @param {Object} query 查询参数
 */
export function serialize(query) {
	let _arr;
	let params = [];
	each(query, function (item, key) {
		if (!isUndefined(item)) {
			_arr = isArray(item);
			if (isPlainObject(item) || _arr) {
				params = params.concat(stringifyParams(item, key, _arr));
			}
			else {
				params.push(staticEncodeURIComponent(key) + '=' + staticEncodeURIComponent(isNull(item) ? '' : item));
			}
		}
	});
	return params.join('&').replace(/%20/g, '+');
}
