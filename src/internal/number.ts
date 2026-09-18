/**
 * 数值精度修正内部原子操作（L0）
 *
 * 移植自旧版（xe-utils 的精度修正运算核心）：
 * - src/helpers/helperNumberAdd.js
 * - src/helpers/helperNumberDecimal.js
 * - src/helpers/helperNumberDivide.js
 * - src/helpers/helperNumberOffsetPoint.js
 *
 * 旧版 helperNumberAdd/helperNumberDivide 依赖 src/number/toNumberString.js、
 * src/number/multiply.js（间接还有 toNumber.js）。L0 层不得引用旧 src，故将
 * 三者在此逐行内联（行为对齐，不做“优化”）；toNumberString 已导出为唯一
 * canonical 实现（2.0 去重，number 域公共出口经 re-export 保持），toNumber/
 * multiply 保持私有，公共 multiply 由 M3 的 number 模组另行实现。
 *
 * 依赖方向与旧版一致：number → string（旧 number/toNumberString.js 引
 * helpers/helperStringRepeat.js），不构成环。
 */
import { helperStringRepeat } from './string'

/** 数值字符串的十进制小数位数（旧 helperNumberDecimal） */
export function helperNumberDecimal(numStr: string): number {
  return (numStr.split('.')[1] || '').length
}

/** 在字符串指定位置插入小数点（旧 helperNumberOffsetPoint） */
export function helperNumberOffsetPoint(str: string, offsetIndex: number): string {
  return str.substring(0, offsetIndex) + '.' + str.substring(offsetIndex, str.length)
}

/**
 * 加法运算（精度修正，旧 helperNumberAdd）。
 *
 * 返回 number（不是字符串）：以两者最大小数位放大为整数求和后再缩回，
 * helperNumberAdd(0.1, 0.2) === 0.3。
 *
 * 2.0 性能：双精度整数加法本身精确，走字符串路径时小数位为 0、ratio 恒为 1，
 * 两路径逐位等价——整数入参直接裸加（实测热循环 ~187ms → ~3ms），
 * 小数/字符串入参仍走字符串修正路径。`|| 0` 收敛 -0 + -0 的符号差异
 * （字符串路径经 parseFloat 恒产出 +0）。
 */
export function helperNumberAdd(addend: number | string, augend: number | string): number {
  if (typeof addend === 'number' && Number.isInteger(addend)) {
    if (typeof augend === 'number' && Number.isInteger(augend)) {
      return addend + augend || 0
    }
  }
  const str1 = toNumberString(addend)
  const str2 = toNumberString(augend)
  const ratio = Math.pow(10, Math.max(helperNumberDecimal(str1), helperNumberDecimal(str2)))
  return (multiply(addend, ratio) + multiply(augend, ratio)) / ratio
}

/** 除法运算（精度修正，旧 helperNumberDivide，参数名照旧保留旧版拼写） */
export function helperNumberDivide(divisor: number | string, dividend: number | string): number {
  const str1 = toNumberString(divisor)
  const str2 = toNumberString(dividend)
  const divisorDecimal = helperNumberDecimal(str1)
  const dividendDecimal = helperNumberDecimal(str2)
  const powY = dividendDecimal - divisorDecimal
  const isMinus = powY < 0
  const multiplicand = Math.pow(10, isMinus ? Math.abs(powY) : powY)
  return multiply(
    Number(str1.replace('.', '')) / Number(str2.replace('.', '')),
    isMinus ? 1 / multiplicand : multiplicand,
  )
}

/**
 * 数值转字符串，科学计数法展开为十进制字面量（canonical，旧
 * src/number/toNumberString.js）。
 *
 * 2.0 去重：M3 时期本函数私有内联（number/toNumberString.ts 公共版与
 * string/toValueString.ts 复刻版各自一份），现导出为唯一实现，
 * 两处改引本函数（number 域公共 API 经 number/toNumberString.ts 具名 re-export
 * 保持出口不变）。
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/number/toNumberString.json：
 * - 1e+21 → "1000000000000000000000"、1.2e-7 → "0.00000012"；
 * - 非数字字符串原样返回（"abc" → "abc"，仅做 '' + num 取串）；
 * - 负号取自 `num < 0` 的比较结果而非正则捕获的符号位（旧实现如此，忠实保留；
 *   字符串入参时 JS 关系比较会按数值比较，行为与数值入参一致）。
 */
export function toNumberString(num: number | string): string {
  const rest = '' + num
  const scienceMatchs = rest.match(/^([-+]?)((\d+)|((\d+)?[.](\d+)?))e([-+]{1})([0-9]+)$/)
  if (scienceMatchs) {
    // 旧实现为 num < 0（字符串入参时 JS 比较为 false，保留该语义）
    const isNegative = (num as number) < 0
    const absFlag = isNegative ? '-' : ''
    const intNumStr = scienceMatchs[3] || ''
    const dIntNumStr = scienceMatchs[5] || ''
    const dFloatNumStr = scienceMatchs[6] || ''
    const sciencFlag = scienceMatchs[7] ?? ''
    // 分组 7、8 在正则命中时必然存在
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

/**
 * 转数值（旧 src/number/toNumber.js，即 helperCreateToNumber(parseFloat) 的
 * 私有内联）：空值与不可解析值一律返回 0，与旧实现一致。
 */
function toNumber(value: number | string): number {
  if (value) {
    const num = parseFloat(String(value))
    if (!isNaN(num)) {
      return num
    }
  }
  return 0
}

/**
 * 乘法运算（旧 src/number/multiply.js 的私有内联）：抹掉小数点做整数乘法，
 * 再按两者小数位数之和缩回。
 */
function multiply(num1: number | string, num2: number | string): number {
  const multiplier = toNumber(num1)
  const multiplicand = toNumber(num2)
  const str1 = toNumberString(multiplier)
  const str2 = toNumberString(multiplicand)
  return (
    (parseInt(str1.replace('.', '')) * parseInt(str2.replace('.', ''))) /
    Math.pow(10, helperNumberDecimal(str1) + helperNumberDecimal(str2))
  )
}
