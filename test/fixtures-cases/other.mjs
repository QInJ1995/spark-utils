/**
 * other 模块行为快照用例（锁定 v1 旧行为，供 2.0 TS 重写比对）
 * 覆盖 3 个方法：validate2ndIdCard hkIdVerify macauIdCard
 * 排除：onMountDialog（Vue2 专属将删除）、promiseResultHandle（异步）、
 *       StateFlow（class 无法用 args 直接调用，见汇报说明）
 * 说明：三个证件校验的错误信息 push 进第二参 errors 数组（生成器只克隆 args 调用，
 *       快照仅记录返回值；errors 内容以 note 说明）
 */
export default {
  module: 'other',
  methods: {
    validate2ndIdCard: [
      { args: ['11010519491231002X', []], note: '合法：校验位 X 正确；errors 不 push，返回 undefined' },
      { args: ['110105194912310021', []], note: '校验位错误：errors push "身份证编码规则验证失败"（快照仅记录返回值 undefined）' },
      { args: ['123456', []], note: '长度错误：errors push "身份证长度不合法"' },
      { args: [undefined, []], note: 'undefined 无 length，抛 TypeError' },
    ],
    hkIdVerify: [
      { args: ['A123456(3)', []], note: '合法：单字母 + 6 数字 + 括号校验位 3，返回 true' },
      { args: ['AB123456(9)', []], note: '合法：双字母校验位 9，返回 true' },
      { args: ['A1234563', []], note: '合法：无括号 8 位裸格式同样通过' },
      { args: ['A123456(0)', []], note: '校验位错误：errors push "香港身份证验证失败"，返回 false' },
      { args: ['A12345', []], note: '长度小于 8：errors push 长度错误，返回 false' },
      { args: [undefined, []], note: 'undefined 无 length，抛 TypeError' },
    ],
    macauIdCard: [
      { args: ['12345678', []], note: '合法：1 开头 7 数字 + 校验位' },
      { args: ['56871234', []], note: '合法：5 开头' },
      { args: ['7123456A', []], note: '合法：校验位可为字母' },
      { args: ['23456789', []], note: '前缀 2 非法：errors push "澳门身份证验证失败!"，返回 undefined（非 false）' },
      { args: ['12345', []], note: '长度不足：同样返回 undefined' },
      { args: ['|1234567', []], note: '怪癖：正则字符组 [1|5|7] 含裸竖线，| 开头也算合法，返回 true' },
    ],
  },
}
