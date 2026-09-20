/**
 * 转数值（移植自旧 src/number/toNumber.js，即 helperCreateToNumber(parseFloat)）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/number/toNumber.json：
 * - parseFloat 语义：截断数字前缀（"12.5abc" → 12.5）、忽略前导空白；
 * - 不识别 16 进制前缀（"0x1F" 在 x 处停止 → 0，对照 toInteger 返回 31）；
 * - 空串、false、null、undefined 与解析失败一律返回 0。
 */
import { helperCreateToNumber } from './helperCreateToNumber'

/** 转数值（parseFloat 语义；空值与不可解析值返回 0） */
export const toNumber: (value: unknown) => number = helperCreateToNumber(parseFloat)
