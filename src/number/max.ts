/**
 * 获取最大值（移植自旧 src/number/max.js，即 helperCreateMinMax(rest < itemVal)）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/number/max.json：
 * - 负数数组取最大（[-5, -2, -8] → -2）；
 * - iterate 为函数或属性路径字符串时按取值比较，返回原数组元素（对象本身）；
 * - 空数组返回 undefined。
 */
import { helperCreateMinMax } from './helperCreateMinMax'

/** 获取数组最大值（可按回调或属性路径取值比较） */
// 比较值沿用旧版抽象比较（字符串 / 数字均可），as 仅编译期标注，运行时行为不变
export const max = helperCreateMinMax((rest, itemVal) => (rest as number) < (itemVal as number))
