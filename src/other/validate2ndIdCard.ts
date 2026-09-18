/**
 * 二代身份证校验（移植自旧 src/other/validate2ndIdCard.js）
 *
 * 加权因子与校验码映射逐字保留；校验算法（前 17 位加权求和 mod 11 查表比对第 18 位）不变。
 * 2.0 出参改造（有意 API 变更，集成时需在 test/overrides.json 登记）：
 * 旧版恒返回 undefined 并向 errors 参数 push 文案，新版返回 IDCardResult 判别对象；
 * 入参非字符串（如 undefined）时仍在读取 length 处抛 TypeError（与旧版一致）。
 */
import type { IDCardResult } from './idCardResult'

const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const validateCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

/**
 * 校验二代身份证号（18 位，末位 X 大写）
 *
 * @param idCard 身份证号
 * @returns 统一判别对象：长度不符 code=LENGTH；校验位不符 code=CHECKSUM
 */
export function validate2ndIdCard(idCard: string): IDCardResult {
  // 二代身份证长度验证
  if (idCard.length !== 18) {
    return { valid: false, code: 'LENGTH', msg: '身份证长度不合法' }
  }
  let checksum = 0
  factors.forEach((factor, i) => {
    const v = Number(idCard.charAt(i))
    checksum += v * factor
  })
  const result = checksum % 11
  if (validateCode[result] !== idCard.charAt(17)) {
    return { valid: false, code: 'CHECKSUM', msg: '身份证编码规则验证失败' }
  }
  return { valid: true }
}
