/**
 * 判断密码等级（移植自旧 src/string/checkPass.js）
 *
 * 密码等级分为四种（4 种字符类型：0-9、a-z、A-Z、特殊字符）：
 * - 难度等级 1：6 位纯数字；
 * - 难度等级 2：4 选 2，8-16 位；
 * - 难度等级 3：4 选 3，8-16 位（默认）；
 * - 难度等级 4：4 选 4，10-18 位。
 *
 * 怪癖忠实保留（见 test/fixtures/string/checkPass.json）：
 * - 6 位纯数字直接返回 1（不受长度 8-20 限制约束）；
 * - 中文/空格检测正则为 /[⺀-鿿] | [\S]/（模式中的字面空格使
 *   字符类永远无法命中空格，仅 \S 生效），原样保留；
 * - 恰好只命中 1 类时视为弱密码归零。
 *
 * @param value 密码字符串（undefined 返回 0）
 */
const pureSixDigitsRE = /^\d{6}$/
const cjkOrSymbolRE = /[⺀-鿿] | [\S]/
const digitRE = /\d/
const lowerCaseRE = /[a-z]/
const upperCaseRE = /[A-Z]/
const specialCharRE = /[\W_]/

/** 判断密码强度等级（0-4），不能包含中文和空格，长度 8-20 */
export function checkPass(value: string | undefined): number {
  if (typeof value === 'undefined') {
    return 0
  }
  let modes = 0

  if (pureSixDigitsRE.test(value)) {
    // 6 位纯数字
    return modes + 1
  }
  if (cjkOrSymbolRE.test(value)) {
    // 不能包含中文和空格
    return modes
  }
  if (value.length < 8 || value.length > 20) {
    // 密码长度 8 到 20
    return modes
  }
  if (digitRE.test(value)) {
    // 如果用户输入的密码包含了数字
    modes++
  }
  if (lowerCaseRE.test(value)) {
    // 如果用户输入的密码包含了小写的 a 到 z
    modes++
  }
  if (upperCaseRE.test(value)) {
    // 如果用户输入的密码包含了大写的 A 到 Z
    modes++
  }
  if (specialCharRE.test(value)) {
    // 如果是特殊字符
    modes++
  }
  if (modes === 1) {
    modes = 0
  }

  return modes
}
