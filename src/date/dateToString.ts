/**
 * date 转换为 string（移植自旧 src/date/dateToString.js，moment → dayjs）
 *
 * 2.0 变更：格式化引擎由 moment 替换为 dayjs（token 语义一致：YYYY/MM/DD/
 * HH/mm/ss/SSS/Z 等），行为基准见 test/fixtures/date/dateToString.json：
 * - 不传 format 输出本地时区 ISO 形态（YYYY-MM-DDTHH:mm:ssZ，如
 *   2024-03-05T08:30:00+08:00）——dayjs 默认格式串与 moment 默认格式串相同；
 * - 非法输入输出 'Invalid date'——dayjs 原生输出为 'Invalid Date'（大写 D），
 *   此处按 moment 兼容语义统一映射。
 */
import dayjs from 'dayjs'

/**
 * date 转换为 string
 *
 * @param date 日期（Date / 时间戳 / 可解析串）
 * @param format 输出格式（moment/dayjs token；缺省为 YYYY-MM-DDTHH:mm:ssZ）
 * @returns 格式化字符串；非法输入返回 'Invalid date'
 */
export function dateToString(date: string | number | Date, format?: string): string {
  const instance = dayjs(date)
  return instance.isValid() ? instance.format(format) : 'Invalid date'
}
