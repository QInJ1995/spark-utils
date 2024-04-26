import isFunction from '../basic/isFunction'
import eqNull from '../basic/eqNull'
import get from '../object/get'
import arrayEach from '../array/arrayEach'

function helperCreateMinMax (handle) {
	return function (arr, iterate) {
		if (arr && arr.length) {
			var rest, itemIndex
			arrayEach(arr, function (itemVal, index) {
				if (iterate) {
					itemVal = isFunction(iterate) ? iterate(itemVal, index, arr) : get(itemVal, iterate)
				}
				if (!eqNull(itemVal) && (eqNull(rest) || handle(rest, itemVal))) {
					itemIndex = index
					rest = itemVal
				}
			})
			return arr[itemIndex]
		}
		return rest
	}
}

export default helperCreateMinMax
