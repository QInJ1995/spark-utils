/**
 * 数值转字符串，科学计数法展开为十进制字面量（移植自旧 src/number/toNumberString.js）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/number/toNumberString.json：
 * - 1e+21 → "1000000000000000000000"、1.2e-7 → "0.00000012"、-0.0000015 → "-0.0000015"；
 * - 非数字字符串原样返回（"abc" → "abc"，仅做 '' + num 取串）；
 * - 负号取自 `num < 0` 的比较结果而非正则捕获的符号位（旧实现如此，忠实保留；
 *   字符串入参时 JS 关系比较会按数值比较，行为与数值入参一致）。
 */
import { helperNumberOffsetPoint } from '../internal/number'
import { helperStringRepeat } from '../internal/string'

/** 科学计数法字面量探测正则（模块顶层预编译，与旧实现同一模式） */
const scienceRE = /^([-+]?)((\d+)|((\d+)?[.](\d+)?))e([-+]{1})([0-9]+)$/

/** 数值转字符串，科学计数法展开为十进制字面量 */
export function toNumberString(num: number | string): string {
  const rest = '' + num
  const scienceMatchs = rest.match(scienceRE)
  if (scienceMatchs) {
    // 旧实现为 num < 0（字符串入参时按数值比较），此处保留该语义
    const isNegative = (num as number) < 0
    const absFlag = isNegative ? '-' : ''
    const intNumStr = scienceMatchs[3] || ''
    const dIntNumStr = scienceMatchs[5] || ''
    const dFloatNumStr = scienceMatchs[6] || ''
    const sciencFlag = scienceMatchs[7] || ''
    // 分组 8 在正则命中时必然存在
    const scienceNumStr = scienceMatchs[8] ?? '0'
    const floatOffsetIndex = Number(scienceNumStr) - dFloatNumStr.length
    const intOffsetIndex = Number(scienceNumStr) - intNumStr.length
    const dIntOffsetIndex = Number(scienceNumStr) - dIntNumStr.length
    if (sciencFlag === '+') {
      if (intNumStr) {
        return absFlag + intNumStr + helperStringRepeat('0', Number(scienceNumStr))
      }
      if (floatOffsetIndex > 0) {
        return absFlag + dIntNumStr + dFloatNumStr + helperStringRepeat('0', floatOffsetIndex)
      }
      return absFlag + dIntNumStr + helperNumberOffsetPoint(dFloatNumStr, Number(scienceNumStr))
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
