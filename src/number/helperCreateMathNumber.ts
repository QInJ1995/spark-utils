/**
 * 舍入函数工厂（内部模块，移植自旧 src/helpers/helperCreateMathNumber.js）
 *
 * round / ceil / floor 三个公共方法共用本工厂，行为（含怪癖）与旧版一致：
 * - falsy 数值（toNumber 归 0 后）直接返回 0，不做舍入；
 * - digits 先 `>> 0` 取整（undefined / NaN → 0）；
 * - 截取前 digits + 1 位小数后若已覆盖全部小数（digits >= 小数位长度），
 *   直接 toNumber 返回截取值（无舍入发生）；
 * - 否则放大 10^digits 舍入再缩回；digits 为 0 时对原值整体舍入。
 *
 * 不进 index.ts 具名导出。
 */
import { toNumber } from './toNumber'
import { toNumberString } from './toNumberString'

/** 舍入方法名（Math 同名函数） */
export type MathNumberName = 'round' | 'ceil' | 'floor'

/** 数值舍入回调签名 */
type MathNumberFn = (num: number | string, digits?: number) => number

/** 创建指定 Math 舍入语义的数值方法（round / ceil / floor） */
export function helperCreateMathNumber(name: MathNumberName): MathNumberFn {
  const mathFn: (x: number) => number = Math[name]
  return function (num: number | string, digits?: number): number {
    const numRest = toNumber(num)
    let rest = numRest
    if (numRest) {
      const dig = (digits ?? 0) >> 0
      const numStr = toNumberString(numRest)
      const nums = numStr.split('.')
      const intStr = nums[0] ?? ''
      const floatStr = nums[1] ?? ''
      const fStr = floatStr.substring(0, dig + 1)
      const subRest = intStr + (fStr ? '.' + fStr : '')
      if (dig >= floatStr.length) {
        return toNumber(subRest)
      }
      if (dig > 0) {
        const ratio = Math.pow(10, dig)
        rest = mathFn(numRest * ratio) / ratio
      } else {
        rest = mathFn(numRest)
      }
    }
    return rest
  }
}
