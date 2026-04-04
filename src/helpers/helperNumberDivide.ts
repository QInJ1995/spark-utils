import helperNumberDecimal from './helperNumberDecimal'
import toNumberString from '../number/toNumberString'
import multiply from '../number/multiply'

function helperNumberDivide (divisor, dividend) {
  const str1 = toNumberString(divisor)
  const str2 = toNumberString(dividend)
  const divisorDecimal = helperNumberDecimal(str1)
  const dividendDecimal = helperNumberDecimal(str2)
  const powY = dividendDecimal - divisorDecimal
  const isMinus = powY < 0
  const multiplicand = Math.pow(10, isMinus ? Math.abs(powY) : powY)
  return multiply(str1.replace('.', '') / str2.replace('.', ''), isMinus ? 1 / multiplicand : multiplicand)
}

export default helperNumberDivide
