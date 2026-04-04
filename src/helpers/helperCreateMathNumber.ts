import toNumber from '../number/toNumber'
import toNumberString from '../number/toNumberString'

function helperCreateMathNumber(name) {
  return function (num, digits) {
    const numRest = toNumber(num)
    let rest = numRest
    if (numRest) {
      digits = digits >> 0
      const numStr = toNumberString(numRest)
      const nums = numStr.split('.')
      const intStr = nums[0]
      const floatStr = nums[1] || ''
      const fStr = floatStr.substring(0, digits + 1)
      let subRest = intStr + (fStr ? ('.' + fStr) : '')
      if (digits >= floatStr.length) {
        return toNumber(subRest)
      }
      subRest = numRest
      if (digits > 0) {
        const ratio = Math.pow(10, digits)
        rest = Math[name](subRest * ratio) / ratio
      } else {
        rest = Math[name](subRest)
      }
    }
    return rest
  }
}

export default helperCreateMathNumber
