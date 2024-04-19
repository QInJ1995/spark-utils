/**
 * 将数字转换为中文的金额
 * @method cnMoneyFormat
 * @param {Number} money 数字
 */
export function cnMoneyFormat(money) {
  let cnMoney = '零元整'
  let strOutput = ''
  let strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分'
  money += '00'
  const intPos = money.indexOf('.')
  if (intPos >= 0) {
    money = money.substring(0, intPos) + money.substr(intPos + 1, 2)
  }
  strUnit = strUnit.substr(strUnit.length - money.length)
  for (let i = 0; i < money.length; i++) {
    strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(money.substr(i, 1), 1)
      + strUnit.substr(i, 1)
  }
  cnMoney = strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(
    /零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元')
    .replace(/亿零{0,3}万/, '亿').replace(/^元/, '零元')
  return cnMoney
}

export default cnMoneyFormat
