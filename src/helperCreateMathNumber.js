import toNumber from './toNumber'
import toNumberString from './toNumberString'

function helperCreateMathNumber(name) {
  return function (num, digits) {
    var numRest = toNumber(num)
    var rest = numRest
    if (numRest) {
      digits = digits >> 0
      var numStr = toNumberString(numRest)
      var nums = numStr.split('.')
      var intStr = nums[0]
      var floatStr = nums[1] || ''
      var fStr = floatStr.substring(0, digits + 1)
      var subRest = intStr + (fStr ? ('.' + fStr) : '')
      if (digits >= floatStr.length) {
        return toNumber(subRest)
      }
      subRest = numRest
      if (digits > 0) {
        var ratio = Math.pow(10, digits)
        rest = Math[name](subRest * ratio) / ratio
      } else {
        rest = Math[name](subRest)
      }
    }
    return rest
  }
}

export default helperCreateMathNumber
