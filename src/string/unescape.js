import staticEscapeMap from '../constant/static/staticEscapeMap'
import helperFormatEscaper from '../helpers/helperFormatEscaper'
import each from '../basic/each'

var unescapeMap = {}
each(staticEscapeMap, function (item, key) {
	unescapeMap[staticEscapeMap[key]] = key
})

/**
  * 反转escape
  *
  * @param {String} str 字符串
  * @return {String}
  */
var unescape = helperFormatEscaper(unescapeMap)

export default unescape
