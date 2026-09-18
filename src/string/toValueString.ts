/**
 * 取字符串（移植自旧 src/string/toValueString.js）
 *
 * - number 入参走科学计数展开（toString(1e+21) → "1000000000000000000000"）；
 * - null / undefined 返回 ''；
 * - 其余类型 `'' + 值` 拼接取串。
 *
 * 横引消除：旧版横向引用 number 域的 toNumberString；string 域禁止反向引
 * number 域（避免重建旧版 number ↔ string 循环依赖），而 internal/number.ts
 * 未导出其私有 toNumberString，故在此从 number 域逻辑等价复刻为内部函数
 * （来源：旧 src/number/toNumberString.js，逻辑与 src/number/toNumberString.ts
 * 完全一致；本文件入参经 isNumber 守卫恒为 number，无字符串入参分支差异）。
 */
import { helperNumberOffsetPoint } from '../internal/number'
import { helperStringRepeat } from '../internal/string'
import { eqNull, isNumber } from '../internal/type'

/** 科学计数法字面量探测正则（模块顶层预编译，与旧实现同一模式） */
const scienceRE = /^([-+]?)((\d+)|((\d+)?[.](\d+)?))e([-+]{1})([0-9]+)$/

/** 取字符串（数值展开科学计数法，空值归空串） */
export function toValueString(obj: unknown): string {
  if (isNumber(obj)) {
    return toNumberStringLocal(obj)
  }
  // 旧实现为 '' + (eqNull(obj) ? '' : obj)；对非空值做 ToPrimitive 拼接，cast 仅作用于编译期
  return '' + (eqNull(obj) ? '' : (obj as string))
}

/**
 * 数值转字符串，科学计数法展开为十进制字面量
 * （自 number 域等价复刻：旧 src/number/toNumberString.js）
 */
function toNumberStringLocal(num: number): string {
  const rest = '' + num
  const scienceMatchs = rest.match(scienceRE)
  if (scienceMatchs) {
    const isNegative = num < 0
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
