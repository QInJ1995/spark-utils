/**
 * 乘法运算（精度修正）（移植自旧 src/number/multiply.js）
 *
 * 抹掉小数点做整数乘法，再按两者小数位数之和缩回：
 * multiply(0.07, 100) → 7、multiply(3, 0.3) → 0.9、multiply(0.1, 0.2) → 0.02，
 * 见 test/fixtures/number/multiply.json。非数字按 0 参与。
 */
import { helperNumberDecimal } from '../internal/number'
import { toNumber } from './toNumber'
import { toNumberString } from './toNumberString'

/** 乘法运算（精度修正）：num1 * num2 */
export function multiply(
  num1: number | string | null | undefined,
  num2: number | string | null | undefined,
): number {
  const multiplier = toNumber(num1)
  const multiplicand = toNumber(num2)
  const str1 = toNumberString(multiplier)
  const str2 = toNumberString(multiplicand)
  return (
    (parseInt(str1.replace('.', ''), 10) * parseInt(str2.replace('.', ''), 10)) /
    Math.pow(10, helperNumberDecimal(str1) + helperNumberDecimal(str2))
  )
}
