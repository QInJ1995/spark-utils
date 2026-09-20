/**
 * 脱敏规则库（移植自旧 src/string/ruleLib.js）
 *
 * 内部模块：供 format 分发，不进 index.ts 具名导出。
 * 各规则结构与正则逐字保留（含 mobile 的字符类字面量竖线 [3|4|5|7|8] 旧怪癖）。
 *
 * 旧版 desensitization 内以 this.indexRule / this.reqRule 引用同规则字段
 * （调用方恒为 rule.desensitization(value)，this 即规则对象）；改为直接引用
 * 具名常量，运行时行为一致。
 */
import { formatWithIndex, type IndexRule } from './formatWithIndex'
import { formatWithReq, type ReqRule } from './formatWithReq'

/** 单条脱敏规则 */
export interface DesensitizeRule {
  /** 下标脱敏规则（供 formatWithIndex） */
  indexRule?: IndexRule[]
  /** 正则脱敏规则（供 formatWithReq） */
  reqRule?: ReqRule
  /** 脱敏执行函数 */
  desensitization?: (value: string) => string
}

/** 下标脱敏规则（name / idcard / date / zipcode / telphone / mobile 复用） */
const indexRules = {
  name: [{ start: 2, stop: null }] as IndexRule[],
  idcard: [{ start: 4, stop: 14 }] as IndexRule[],
  date: [{ start: 6, stop: 7 }, { start: 9, stop: 10 }] as IndexRule[],
  zipcode: [{ start: 2, stop: null }] as IndexRule[],
  telphone: [{ start: 6, stop: null }] as IndexRule[],
  mobile: [{ start: 4, stop: 7 }] as IndexRule[],
}

/** email 正则脱敏规则（单独提取供 desensitization 引用） */
const emailReqRule: ReqRule = {
  srcReq: /^(\w+([-+.]\w+)*)@(\w+([-.]\w+)*\.\w+([-.]\w+)*)$/,
  descReq: '****@$3',
}

/** 脱敏规则库（未知 key（含 ip）无 desensitization，调用时抛 TypeError，与旧版一致） */
export const ruleLib: Record<string, DesensitizeRule> = {
  name: {
    indexRule: indexRules.name,
    reqRule: { srcReq: /^(\w{1})\w*$/, descReq: '$1*' },
    desensitization(value: string): string {
      return formatWithIndex(value, indexRules.name)
    },
  },
  idcard: {
    indexRule: indexRules.idcard,
    reqRule: { srcReq: /^([\d]{3})\d{1,11}(\w*)$/, descReq: '$1********$2' },
    desensitization(value: string): string {
      return formatWithIndex(value, indexRules.idcard)
    },
  },
  date: {
    indexRule: indexRules.date,
    reqRule: { srcReq: /^([\d]{4}-)(\w*)$/, descReq: '$1********' },
    desensitization(value: string): string {
      return formatWithIndex(value, indexRules.date)
    },
  },
  email: {
    reqRule: emailReqRule,
    desensitization(value: string): string {
      return formatWithReq(value, emailReqRule)
    },
  },
  zipcode: {
    indexRule: indexRules.zipcode,
    reqRule: { srcReq: /^([1-9])[0-9]{1,5}$/, descReq: '$1*****' },
    desensitization(value: string): string {
      return formatWithIndex(value, indexRules.zipcode)
    },
  },
  telphone: {
    indexRule: indexRules.telphone,
    reqRule: { srcReq: /^([0-9]{3,4})-\d*$/, descReq: '$1-********' },
    desensitization(value: string): string {
      return formatWithIndex(value, indexRules.telphone)
    },
  },
  mobile: {
    indexRule: indexRules.mobile,
    // 字符类中的竖线为字面量（旧码原样保留，仅匹配 3/4/5/7/8）
    reqRule: { srcReq: /^(1[3|4|5|7|8][0-9])\d{1,4}(\d*)$/, descReq: '$1****$2' },
    desensitization(value: string): string {
      return formatWithIndex(value, indexRules.mobile)
    },
  },
  ip: {},
}
