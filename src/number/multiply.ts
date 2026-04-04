import helperNumberDecimal from '../helpers/helperNumberDecimal'
import toNumberString from './toNumberString'
import toNumber from './toNumber'

/**
 * 乘法运算
 *
 * @param { Number } num1 数值1
 * @param { Number } num2 数值2
 * @return {Number}
 */
function multiply (num1, num2) {
  const multiplier = toNumber(num1)
  const multiplicand = toNumber(num2)
  const str1 = toNumberString(multiplier)
  const str2 = toNumberString(multiplicand)
  return parseInt(str1.replace('.', '')) * parseInt(str2.replace('.', '')) / Math.pow(10, helperNumberDecimal(str1) + helperNumberDecimal(str2))
}

export default multiply
