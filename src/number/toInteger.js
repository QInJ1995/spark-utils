import staticParseInt from '../constant/static/staticParseInt'
import helperCreateToNumber from '../helpers/helperCreateToNumber'

/**
 * 转整数
 * @param { String/Number } str 数值
 *
 * @return {Number}
 */
var toInteger = helperCreateToNumber(staticParseInt)

export default toInteger
