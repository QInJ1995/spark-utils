import round from './round'
import toValueString from '../string/toValueString'
import helperStringRepeat from '../helpers/helperStringRepeat'
import helperNumberOffsetPoint from '../helpers/helperNumberOffsetPoint'

/**
  * 将数值四舍五入并格式化为固定小数位的字符串
  *
 * @param {string|number} num 数值
 * @param {number} digits 小数保留位数
  * @return {String}
  */
function toFixed (num, digits) {
  digits = digits >> 0
  const str = toValueString(round(num, digits))
  const nums = str.split('.')
  const intStr = nums[0]
  const floatStr = nums[1] || ''
  const digitOffsetIndex = digits - floatStr.length
  if (digits) {
    if (digitOffsetIndex > 0) {
      return intStr + '.' + floatStr + helperStringRepeat('0', digitOffsetIndex)
    }
    return intStr + helperNumberOffsetPoint(floatStr, Math.abs(digitOffsetIndex))
  }
  return intStr
}

export default toFixed
