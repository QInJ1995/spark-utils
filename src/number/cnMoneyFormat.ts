/**
 * 将数字转换为中文金额大写（移植自旧 src/number/cnMoneyFormat.js）
 *
 * 怪癖忠实保留（见 test/fixtures/number/cnMoneyFormat.json）：
 * - 尾零不清理（"88.5" → "捌拾捌元伍角零分"）；
 * - 连续零折叠依赖末尾一条 replace 链（1001 → "壹仟零壹元整"）；
 * - 0 → "零元整"。
 *
 * 已废弃的 String.prototype.substr 全部改为等价 slice / charAt（输出等价）：
 * substr(start, len) → slice(start, start + len)；负 start 两者均从尾部计数；
 * substr 的数值化 NaN 起点等价于 0，以 `Number(x) || 0` 显式表达。
 */

/** 中文数字表（零壹贰叁肆伍陆柒捌玖） */
const cnNums = '零壹贰叁肆伍陆柒捌玖'

/** 中文单位表（仟佰拾亿仟佰拾万仟佰拾元角分） */
const cnUnits = '仟佰拾亿仟佰拾万仟佰拾元角分'

/** 尾部归整链（模块顶层预编译，替换顺序即旧版链式顺序，不可调换） */
const tailRegexps: ReadonlyArray<{ reg: RegExp; replacement: string }> = [
  { reg: /零角零分$/, replacement: '整' },
  { reg: /零[仟佰拾]/g, replacement: '零' },
  { reg: /零{2,}/g, replacement: '零' },
  // 旧版字符类写作 [亿|万]，竖线为字面量成员（无交替语义），忠实保留
  { reg: /零([亿|万])/g, replacement: '$1' },
  { reg: /零+元/, replacement: '元' },
  { reg: /亿零{0,3}万/, replacement: '亿' },
  { reg: /^元/, replacement: '零元' },
]

/** 将数字转换为中文金额大写（如 123.45 → "壹佰贰拾叁元肆角伍分"） */
export function cnMoneyFormat(money: number | string): string {
  // 旧实现：money += '00'（字符串拼接补足角分两位）
  let moneyStr = money + '00'
  const intPos = moneyStr.indexOf('.')
  if (intPos >= 0) {
    moneyStr = moneyStr.substring(0, intPos) + moneyStr.slice(intPos + 1, intPos + 3)
  }
  // 旧实现：strUnit.substr(strUnit.length - money.length)，负起点从尾部计数，与 slice 等价
  const strUnit = cnUnits.slice(cnUnits.length - moneyStr.length)
  let strOutput = ''
  for (let i = 0; i < moneyStr.length; i++) {
    const digitChar = moneyStr.charAt(i)
    // 旧实现：cnNums.substr(moneyStr.substr(i, 1), 1)，非数字字符（如残留的小数点）数值化为 NaN → 下标 0
    strOutput += cnNums.charAt(Number(digitChar) || 0) + strUnit.charAt(i)
  }
  let cnMoney = strOutput
  for (const { reg, replacement } of tailRegexps) {
    cnMoney = cnMoney.replace(reg, replacement)
  }
  return cnMoney
}
