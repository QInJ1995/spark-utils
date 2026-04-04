import helperNumberDecimal from './helperNumberDecimal'
import toNumberString from '../number/toNumberString'
import multiply from '../number/multiply'

function helperNumberAdd (addend, augend) {
  const str1 = toNumberString(addend)
  const str2 = toNumberString(augend)
  const ratio = Math.pow(10, Math.max(helperNumberDecimal(str1), helperNumberDecimal(str2)))
  return (multiply(addend, ratio) + multiply(augend, ratio)) / ratio
}

export default helperNumberAdd
