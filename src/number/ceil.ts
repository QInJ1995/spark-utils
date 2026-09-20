/**
 * 将数值向上舍入（移植自旧 src/number/ceil.js，即 helperCreateMathNumber('ceil')）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/number/ceil.json：
 * - ceil(4.2) → 5、ceil(-4.2) → -4（负数向 +Infinity 方向）；
 * - ceil(0.123, 2) → 0.13、整数与字符串数字输入原样 / 解析处理。
 */
import { helperCreateMathNumber } from './helperCreateMathNumber'

/** 将数值向上舍入，digits 为保留小数位数（`>> 0` 取整，缺省 0） */
export const ceil = helperCreateMathNumber('ceil')
