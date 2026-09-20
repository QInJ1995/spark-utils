/**
 * 将数字转换为金额显示，每三位逗号隔开（移植自旧 src/number/moneyFormat.js）
 *
 * 2.0 修复（有意变更，集成时在 test/overrides.json 登记对应快照用例）：
 * 旧版守卫 `!money || isNaN(money)` 把 0 一并视为非法输入返回 ''。现改为显式
 * 空值 / NaN 判定（money == null || money === '' || Number.isNaN(Number(money))，
 * 即“最小修改”方案）：
 * - moneyFormat(0) → '0'、moneyFormat(0, 2) → '0.00'（旧版均返回 ''）；
 * - moneyFormat('0') 旧版本就返回 '0'，行为不变；
 * - '' 保留旧版返回 ''（若放行，parseFloat('') 为 NaN 会输出 'NaN'）；
 * - null / undefined / 不可解析字符串（Number 强转 NaN）仍返回 ''；
 * - 旧版被 !money 拦截的其余 falsy 值（如 false）不再特判，随 parseFloat 语义
 *   输出 'NaN'（快照未覆盖，视为 0 值修复的自然推论）。
 *
 * 千分位逻辑与旧版一致：toFixed 定位小数后以 /(-?\d+)(\d{3})/ 循环插入逗号
 * （旧版 commafy 已并入本方法，不再单独提供）。
 */

/** 千分位插入正则（模块顶层预编译，非全局标志，test 不推进 lastIndex，可循环复用） */
const thousandsRE = /(-?\d+)(\d{3})/

/** 将数字转换为金额显示，每三位逗号隔开（如 1234567.891 → "1,234,567.89"） */
export function moneyFormat(
  money: number | string | null | undefined,
  decimal?: number,
  symbol?: string,
): string {
  if (money == null || money === '' || Number.isNaN(Number(money))) {
    return ''
  }
  const num = parseFloat(String(money))
  let numStr = String(num.toFixed(decimal ? decimal : 0))
  while (thousandsRE.test(numStr)) {
    numStr = numStr.replace(thousandsRE, '$1,$2')
  }
  return symbol ? symbol + numStr : numStr
}
