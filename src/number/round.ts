/**
 * 将数值四舍五入（移植自旧 src/number/round.js，即 helperCreateMathNumber('round')）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/number/round.json：
 * - round(-3.5) → -3（Math.round 对 .5 向 +Infinity 进位）；
 * - round(1.005, 2) → 1（1.005 * 100 浮点误差为 100.4999…，结果 1）；
 * - round(0) / round('abc') → 0（falsy 数值不进舍入分支）。
 */
import { helperCreateMathNumber } from './helperCreateMathNumber'

/** 将数值四舍五入，digits 为保留小数位数（`>> 0` 取整，缺省 0） */
export const round = helperCreateMathNumber('round')
