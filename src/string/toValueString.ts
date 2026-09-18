/**
 * 取字符串（移植自旧 src/string/toValueString.js）
 *
 * - number 入参走科学计数展开（toString(1e+21) → "1000000000000000000000"）；
 * - null / undefined 返回 ''；
 * - 其余类型 `'' + 值` 拼接取串。
 *
 * 横引消除（2.0 去重）：旧版横向引用 number 域的 toNumberString；string 域
 * 禁止反向引 number 域（避免重建旧版 number ↔ string 循环依赖），曾在本文件
 * 等价复刻，现改引 internal/number 导出的 canonical toNumberString
 * （本文件入参经 isNumber 守卫恒为 number，无字符串入参分支差异）。
 */
import { toNumberString } from '../internal/number'
import { eqNull, isNumber } from '../internal/type'

/** 取字符串（数值展开科学计数法，空值归空串） */
export function toValueString(obj: unknown): string {
  if (isNumber(obj)) {
    return toNumberString(obj)
  }
  // 旧实现为 '' + (eqNull(obj) ? '' : obj)；对非空值做 ToPrimitive 拼接，cast 仅作用于编译期
  return '' + (eqNull(obj) ? '' : (obj as string))
}
