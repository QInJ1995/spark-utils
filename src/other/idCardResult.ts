/**
 * 证件校验统一出参（2.0 有意 API 变更）
 *
 * 旧版三个证件方法返回形状各异且以 errors 数组参数做副作用收集：
 * - validate2ndIdCard：恒返回 undefined，失败仅向 errors push；
 * - hkIdVerify：返回 true/false，失败向 errors push；
 * - macauIdCard：成功返回 true，失败向 errors push 并隐式返回 undefined。
 * 2.0 统一为无副作用的判别对象（errors 出参参数删除），code 为机器可读的失败分支码
 * （LENGTH=长度、PATTERN=正则、CHECKSUM=校验位），msg 沿用旧版 push 的文案。
 */
/** 证件校验统一出参 */
export interface IDCardResult {
  /** 是否通过校验 */
  valid: boolean
  /** 失败分支码（LENGTH=长度 / PATTERN=正则 / CHECKSUM=校验位），通过时缺省 */
  code?: 'LENGTH' | 'PATTERN' | 'CHECKSUM'
  /** 失败原因（沿用旧版 errors.push 的文案），通过时缺省 */
  msg?: string
}
