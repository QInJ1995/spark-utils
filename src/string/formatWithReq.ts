/**
 * 按正则规则脱敏（移植自旧 src/string/formatWithReq.js）
 *
 * 忠实保留：无任何空值守卫——reqRule 为空时直接抛 TypeError，入参检查由调用方负责。
 */
export interface ReqRule {
  /** 源正则（捕获组供替换引用） */
  srcReq: RegExp
  /** 替换串（可引用 $1、$2 …） */
  descReq: string
}

/** 以 reqRule.descReq 替换 value 中匹配 reqRule.srcReq 的部分 */
export function formatWithReq(value: string, reqRule: ReqRule): string {
  return value.replace(reqRule.srcReq, reqRule.descReq)
}
