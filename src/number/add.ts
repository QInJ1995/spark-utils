/**
 * 加法运算（精度修正）（移植自旧 src/number/add.js）
 *
 * 经 internal/number 的 helperNumberAdd 做精度修正：
 * add(0.1, 0.2) === 0.3；字符串数字、null / 非数字入参先经 toNumber 归一
 * （null → 0、"abc" → 0），见 test/fixtures/number/add.json。
 */
import { helperNumberAdd } from '../internal/number'
import { toNumber } from './toNumber'

/** 加法运算（精度修正）：num1 + num2 */
export function add(num1: number | string | null | undefined, num2: number | string | null | undefined): number {
  return helperNumberAdd(toNumber(num1), toNumber(num2))
}
