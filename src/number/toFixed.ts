/**
 * 将数值四舍五入并格式化为固定小数位的字符串（移植自旧 src/number/toFixed.js）
 *
 * 横引消除：旧版经 ../string/toValueString 取串（number → string 域横向引用）；
 * 本实现入参先经 round 归一，结果恒为 number，而 toValueString(number) ≡
 * toNumberString(number)，故直接使用本域 toNumberString，语义等价。
 *
 * 行为与旧版一致：
 * - digits 先 `>> 0` 取整（undefined / NaN → 0）；
 * - 小数不足补零（toFixed(1.1, 2) → "1.10"），超出借位收缩（toFixed(1.234, 2) → "1.23"）；
 * - digits 为 0 只返回整数部分（toFixed(-1.5) → "-1"，round(-1.5) 为 -1）。
 */
import { helperNumberOffsetPoint } from '../internal/number'
import { helperStringRepeat } from '../internal/string'
import { round } from './round'
import { toNumberString } from './toNumberString'

/** 将数值四舍五入并格式化为固定小数位的字符串 */
export function toFixed(num: number | string, digits?: number): string {
  const dig = (digits ?? 0) >> 0
  const str = toNumberString(round(num, dig))
  const nums = str.split('.')
  const intStr = nums[0] ?? ''
  const floatStr = nums[1] ?? ''
  const digitOffsetIndex = dig - floatStr.length
  if (dig) {
    if (digitOffsetIndex > 0) {
      return intStr + '.' + floatStr + helperStringRepeat('0', digitOffsetIndex)
    }
    return intStr + helperNumberOffsetPoint(floatStr, Math.abs(digitOffsetIndex))
  }
  return intStr
}
