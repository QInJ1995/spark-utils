/**
 * 将日期格式化为时间戳（移植自旧 src/date/timestamp.js）
 *
 * 行为与旧版一致：
 * - 入参 truthy 时经 toStringDate（可带 format）解析后取毫秒值，
 *   解析失败（Invalid Date）返回 NaN；
 * - 入参 falsy（含不传）返回当前时间戳（now()，即 Date.now——此处直接内联
 *   调用而不引 ./now：旧 src/date/now.js 尚未删除，其扩展无后缀导入在 Vite
 *   运行时会误绑旧实现（默认导出形态，具名导入得 undefined）；行为等价）。
 * 旧实现的 `isDate(date) ? getTime(date) : date` 两支在此收敛为一次取值：
 * toStringDate 恒返回 Date（isDate 恒真，含 Invalid Date——取值为 NaN），
 * 不存在返回原对象的分支。
 */
import { helperGetDateTime, toStringDate } from '../internal/datetime'

/**
 * 将日期格式化为时间戳
 *
 * @param str 日期或数字
 * @param format 解析日期格式
 * @returns 毫秒时间戳；入参 falsy 时返回当前时间戳
 */
export function timestamp(str?: string | number | Date | null, format?: string): number {
  if (str) {
    return helperGetDateTime(toStringDate(str, format))
  }
  return Date.now()
}
