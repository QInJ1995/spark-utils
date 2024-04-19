import {ruleLib} from './ruleLib'

export function format(type, value){
  if(typeof value == 'undefined' || value == null)return ''
  value = value.toString()
  const rule = ruleLib[type]
  return rule.desensitization(value)
}

export default format
