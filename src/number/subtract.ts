/**
 * 减法运算（精度修正）（移植自旧 src/number/subtract.js）
 *
 * 按两者最大小数位放大为整数相减再缩回，结果经 toFixed 定位精度后 parseFloat
 * 去尾零：subtract(1.1, 0.1) → 1（"1.00" → 1），见 test/fixtures/number/subtract.json。
 * 非数字按 0 参与（subtract('abc', 5) → -5）。
 */
import { helperNumberDecimal } from '../internal/number'
import { toFixed } from './toFixed'
import { toNumber } from './toNumber'
import { toNumberString } from './toNumberString'

/** 减法运算（精度修正）：num1 - num2 */
export function subtract(
  num1: number | string | null | undefined,
  num2: number | string | null | undefined,
): number {
  const subtrahend = toNumber(num1)
  const minuend = toNumber(num2)
  const str1 = toNumberString(subtrahend)
  const str2 = toNumberString(minuend)
  const digit1 = helperNumberDecimal(str1)
  const digit2 = helperNumberDecimal(str2)
  const ratio = Math.pow(10, Math.max(digit1, digit2))
  const precision = digit1 >= digit2 ? digit1 : digit2
  return parseFloat(toFixed((subtrahend * ratio - minuend * ratio) / ratio, precision))
}
