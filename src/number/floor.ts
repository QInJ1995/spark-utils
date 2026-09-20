/**
 * 将数值向下舍入（移植自旧 src/number/floor.js，即 helperCreateMathNumber('floor')）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/number/floor.json：
 * - floor(4.7) → 4、floor(-4.2) → -5、floor(-0.5) → -1（负数向 -Infinity 方向）；
 * - floor(123.456, 2) → 123.45、整数原样返回。
 */
import { helperCreateMathNumber } from './helperCreateMathNumber'

/** 将数值向下舍入，digits 为保留小数位数（`>> 0` 取整，缺省 0） */
export const floor = helperCreateMathNumber('floor')
