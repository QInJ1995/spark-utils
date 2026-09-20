/**
 * 获取最小值（移植自旧 src/number/min.js，即 helperCreateMinMax(rest > itemVal)）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/number/min.json：
 * - null 项被跳过（[null, 5, 2] → 2）；
 * - iterate 为函数或属性路径字符串时按取值比较，返回原数组元素（对象本身）；
 * - 空数组返回 undefined。
 */
import { helperCreateMinMax } from './helperCreateMinMax'

/** 获取数组最小值（可按回调或属性路径取值比较） */
// 比较值沿用旧版抽象比较（字符串 / 数字均可），as 仅编译期标注，运行时行为不变
export const min = helperCreateMinMax((rest, itemVal) => (rest as number) > (itemVal as number))
