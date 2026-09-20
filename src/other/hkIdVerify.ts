/**
 * 香港身份证校验（移植自旧 src/other/hkIdVerify.js）
 *
 * 括号处理（末三位为 (x) 时摘括号）、大小写归一、正则与校验位加权算法逐字保留。
 * 2.0 出参改造（有意 API 变更，集成时需在 test/overrides.json 登记）：
 * 旧版返回 true/false 并向 errors 参数 push 文案，新版返回 IDCardResult 判别对象；
 * 入参非字符串（如 undefined）时仍在读取 length 处抛 TypeError（与旧版一致）。
 */
import type { IDCardResult } from './idCardResult'

const strValidChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const hkIdPat = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/

/**
 * 校验香港身份证号（1-2 位字母 + 6 位数字 + 校验位，支持末位括号写法）
 *
 * @param str 身份证号
 * @returns 统一判别对象：长度小于 8 code=LENGTH；正则不符 code=PATTERN；校验位不符 code=CHECKSUM
 */
export function hkIdVerify(str: string): IDCardResult {
  // basic check length
  if (str.length < 8) {
    return { valid: false, code: 'LENGTH', msg: '身份证验证失败!长度小于8' }
  }
  // handling bracket
  let rest = str
  if (rest.charAt(rest.length - 3) === '(' && rest.charAt(rest.length - 1) === ')') {
    rest = rest.substring(0, rest.length - 3) + rest.charAt(rest.length - 2)
  }
  // convert to upper case
  rest = rest.toUpperCase()
  // regular expression to check pattern and split
  const matchArray = rest.match(hkIdPat)
  // not match, return invalid
  if (matchArray == null) {
    return {
      valid: false,
      code: 'PATTERN',
      msg: '身份证验证失败!不满足正则表达式验证规则(^([A-Z]{1,2})([0-9]{6})([A0-9])$)',
    }
  }
  // the character part, numeric part and check digit part
  // 正则保证三个捕获组必然存在，?? '' 仅为类型收窄兜底
  const charPart = matchArray[1] ?? ''
  const numPart = matchArray[2] ?? ''
  const checkDigit = matchArray[3] ?? ''
  // calculate the checksum for character part
  let checkSum = 0
  if (charPart.length === 2) {
    checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)))
    checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)))
  } else {
    checkSum += 9 * 36
    checkSum += 8 * (10 + strValidChars.indexOf(charPart))
  }
  // calculate the checksum for numeric part
  let i = 0
  let j = 7
  for (; i < numPart.length; i++, j--) {
    checkSum += j * Number(numPart.charAt(i))
  }
  // verify the check digit
  const remaining = checkSum % 11
  const verify = remaining === 0 ? '0' : `${11 - remaining}`
  if (verify === checkDigit || (verify === '10' && checkDigit === 'A')) {
    return { valid: true }
  }
  return { valid: false, code: 'CHECKSUM', msg: '香港身份证验证失败' }
}
