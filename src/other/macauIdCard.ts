/**
 * 澳门身份证校验（移植自旧 src/other/macauIdCard.js）
 *
 * 正则逐字保真：字符组 [1|5|7] 中的裸竖线是旧版怪癖（'|1234567' 亦判合法），原样保留。
 * 2.0 出参改造（有意 API 变更，集成时需在 test/overrides.json 登记）：
 * 旧版成功返回 true、失败向 errors push 并隐式返回 undefined，新版返回 IDCardResult 判别对象。
 */
import type { IDCardResult } from './idCardResult'

const macauRegex = /^[1|5|7][0-9]{6}[0-9A-Z]$/

/**
 * 校验澳门身份证号（8 位：首字符 1/5/7（字符组含裸竖线怪癖，'|' 开头亦判合法）+ 6 数字 + 数字或大写字母校验位）
 *
 * @param str 身份证号
 * @returns 统一判别对象：正则不符 code=PATTERN
 */
export function macauIdCard(str: string): IDCardResult {
  if (macauRegex.test(str)) {
    return { valid: true }
  }
  return { valid: false, code: 'PATTERN', msg: '澳门身份证验证失败!' }
}
