/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * 将数字转换为金额显示，每三位逗号隔开
 * @method moneyFormat
 * @param {Number} money 数字
 * @param {Number} decimal 小数位
 * @param {string} symbol 金额前缀，如￥或$
 */
export function moneyFormat(money, decimal, symbol) {
  if (!money || isNaN(money))
    return ''
  const num = parseFloat(money)
  let numStr = String(num.toFixed(decimal ? decimal : 0))
  const re = /(-?\d+)(\d{3})/
  while (re.test(numStr)) {
    numStr = numStr.replace(re, '$1,$2')
  }
  return symbol ? symbol + numStr : numStr
}

export default moneyFormat
