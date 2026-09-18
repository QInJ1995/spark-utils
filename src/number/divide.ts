/**
 * 除法运算（精度修正）（移植自旧 src/number/divide.js）
 *
 * 经 internal/number 的 helperNumberDivide 做精度修正：divide(0.6, 0.2) → 3。
 * 怪癖忠实保留：divide(1, 0) → NaN（内部 parseInt(Infinity) 为 NaN，非 Infinity），
 * 见 test/fixtures/number/divide.json。
 */
import { helperNumberDivide } from '../internal/number'
import { toNumber } from './toNumber'

/** 除法运算（精度修正）：num1 / num2（除以 0 返回 NaN，忠实旧版） */
export function divide(
  num1: number | string | null | undefined,
  num2: number | string | null | undefined,
): number {
  return helperNumberDivide(toNumber(num1), toNumber(num2))
}
