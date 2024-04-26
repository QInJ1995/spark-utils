import eqNull from '../basic/eqNull'
import isNumber from '../basic/isNumber'
import toNumberString from '../number/toNumberString'

function toValueString (obj) {
	if (isNumber(obj)) {
		return toNumberString(obj)
	}
	return '' + (eqNull(obj) ? '' : obj)
}

export default toValueString
