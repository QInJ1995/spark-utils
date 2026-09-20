/**
 * 返回当前时间戳（移植自旧 src/date/now.js）
 *
 * 旧实现为 `Date.now || 降级函数`；ES2020 目标环境 Date.now 恒存在，
 * 降级分支（helperGetDateTime(helperNewDate())）不再保留，行为一致。
 */

/**
 * 返回当前时间戳
 *
 * @returns 毫秒时间戳
 */
export function now(): number {
  return Date.now()
}
