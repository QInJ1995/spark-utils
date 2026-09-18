/**
 * 按规则类型脱敏（移植自旧 src/string/format.js）
 *
 * - value 为 null/undefined 返回 ''；
 * - type 未注册（如 'ip' 规则为空对象）时 rule.desensitization 为 undefined，
 *   调用抛 TypeError（"rule.desensitization is not a function"）——忠实保留。
 *
 * 横引消除：旧版横向引用 ruleLib 属本域内部模块，直接引入。
 */
import { ruleLib, type DesensitizeRule } from './ruleLib'

/** 按规则类型（name/idcard/date/email/zipcode/telphone/mobile）脱敏 */
export function format(type: string, value: unknown): string {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  const valueStr = (value as { toString(): string }).toString()
  const rule = ruleLib[type] as DesensitizeRule
  return (rule.desensitization as (value: string) => string)(valueStr)
}
