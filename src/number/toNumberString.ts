import helperStringRepeat from '../helpers/helperStringRepeat'
import helperNumberOffsetPoint from '../helpers/helperNumberOffsetPoint'

/**
 * 数值转字符串，科学计数转字符串
 * @param { Number } num 数值
 *
 * @return {Number}
 */
function toNumberString(num) {
  const rest = '' + num
  const scienceMatchs = rest.match(/^([-+]?)((\d+)|((\d+)?[.](\d+)?))e([-+]{1})([0-9]+)$/)
  if (scienceMatchs) {
    const isNegative = num < 0
    const absFlag = isNegative ? '-' : ''
    const intNumStr = scienceMatchs[3] || ''
    const dIntNumStr = scienceMatchs[5] || ''
    const dFloatNumStr = scienceMatchs[6] || ''
    const sciencFlag = scienceMatchs[7]
    const scienceNumStr = scienceMatchs[8]
    const floatOffsetIndex = scienceNumStr - dFloatNumStr.length
    const intOffsetIndex = scienceNumStr - intNumStr.length
    const dIntOffsetIndex = scienceNumStr - dIntNumStr.length
    if (sciencFlag === '+') {
      if (intNumStr) {
        return absFlag + intNumStr + helperStringRepeat('0', scienceNumStr)
      }
      if (floatOffsetIndex > 0) {
        return absFlag + dIntNumStr + dFloatNumStr + helperStringRepeat('0', floatOffsetIndex)
      }
      return absFlag + dIntNumStr + helperNumberOffsetPoint(dFloatNumStr, scienceNumStr)
    }
    if (intNumStr) {
      if (intOffsetIndex > 0) {
        return absFlag + '0.' + helperStringRepeat('0', Math.abs(intOffsetIndex)) + intNumStr
      }
      return absFlag + helperNumberOffsetPoint(intNumStr, intOffsetIndex)
    }
    if (dIntOffsetIndex > 0) {
      return absFlag + '0.' + helperStringRepeat('0', Math.abs(dIntOffsetIndex)) + dIntNumStr + dFloatNumStr
    }
    return absFlag + helperNumberOffsetPoint(dIntNumStr, dIntOffsetIndex) + dFloatNumStr
  }
  return rest
}

export default toNumberString
