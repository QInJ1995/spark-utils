import helperCreateToNumber from '../helpers/helperCreateToNumber'

/**
 * 转数值
 * @param { String/Number } str 数值
 *
 * @return {Number}
 */
const toNumber = helperCreateToNumber(parseFloat)

export default toNumber
