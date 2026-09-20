/**
 * 判断是否为时间格式（移植自旧 src/date/isTime.js）
 *
 * 行为（含怪癖）与旧版一致，见 test/fixtures/date/isTime.json：
 * - 仅接受 HH:mm:ss（8 位，小时 00-23，其中 20/21/22/23 或 0/1 开头两位）；
 * - 长度不为 8 直接 false；
 * - 入参无 length（如 undefined）抛 TypeError——按旧版不设防。
 */
/** 时间格式正则（顶层预编译，与旧实现同一模式） */
const timeRE = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/

/**
 * 判断是否为时间格式
 *
 * @param dateval 目标串（HH:mm:ss）
 * @returns 是时间格式返回 true
 */
export function isTime(dateval: string): boolean {
  if (dateval.length !== 8) {
    return false
  }
  return timeRE.test(dateval)
}
