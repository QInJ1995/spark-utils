/**
 * 数值转字符串，科学计数法展开为十进制字面量（移植自旧 src/number/toNumberString.js）
 *
 * 2.0 去重：实现收敛到 internal/number.ts 的 canonical toNumberString
 * （helperNumberAdd/Divide 与 string/toValueString 均依赖同一实现），
 * 此处具名 re-export 保持本域公共 API 出口不变。
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/number/toNumberString.json：
 * - 1e+21 → "1000000000000000000000"、1.2e-7 → "0.00000012"、-0.0000015 → "-0.0000015"；
 * - 非数字字符串原样返回（"abc" → "abc"，仅做 '' + num 取串）。
 */
export { toNumberString } from '../internal/number'
