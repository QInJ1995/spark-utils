import toValueString from '../string/toValueString'
import keys from '../basic/keys'

function helperFormatEscaper (dataMap) {
	var replaceRegexp = new RegExp('(?:' + keys(dataMap).join('|') + ')', 'g')
	return function (str) {
		return toValueString(str).replace(replaceRegexp, function (match) {
			return dataMap[match]
		})
	}
}

export default helperFormatEscaper
