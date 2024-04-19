import staticEscapeMap from '../constant/static/staticEscapeMap'
import helperFormatEscaper from '../helpers/helperFormatEscaper'

/**
  * 转义HTML字符串，替换&, <, >, ", ', `字符
  *
  * @param {String} str 字符串
  * @return {String}
  */
var escape = helperFormatEscaper(staticEscapeMap)

export default escape
