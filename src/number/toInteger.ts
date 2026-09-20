/**
 * 转整数（移植自旧 src/number/toInteger.js，即 helperCreateToNumber(staticParseInt)）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/number/toInteger.json：
 * - parseInt 语义：截断小数（"12.9" → 12，非四舍五入）、忽略空白并截断后缀（"  42px" → 42）；
 * - 识别 16 进制前缀（"0x1F" → 31，对照 toNumber 返回 0）；
 * - 空值与解析失败一律返回 0。
 */
import { helperCreateToNumber } from './helperCreateToNumber'

/** 转整数（parseInt 语义；空值与不可解析值返回 0） */
export const toInteger: (value: unknown) => number = helperCreateToNumber(parseInt)
