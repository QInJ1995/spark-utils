/**
 * 按下标区间脱敏（移植自旧 src/string/formatWithIndex.js）
 *
 * 将 value 中 [start-1, stop-1] 区间内的字符逐位替换为 '*'：
 * - start / stop 为 1 基下标；stop 为空（null/undefined）时打到末尾；
 * - value 长度不足 start 时跳过该条规则（旧版 valueLength < start 的
 *   null → 0 → false 语义，以显式判空等价保留：start 为 null 不跳过）。
 *
 * @param value 待脱敏字符串（null/undefined 返回 ''）
 * @param indexRule 下标规则数组
 */
export interface IndexRule {
  /** 起始下标（1 基），null 表示从头打星 */
  start: number | null
  /** 结束下标（1 基），null/缺省表示打到末尾 */
  stop?: number | null
}

/** 按下标区间将字符替换为 '*' */
export function formatWithIndex(value: string | null | undefined, indexRule: IndexRule[]): string {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  const valueStr = value.toString()
  const valueLength = valueStr.length
  const values = valueStr.split('')

  for (let j = 0; j < indexRule.length; j++) {
    const rule = indexRule[j]
    if (!rule) {
      continue
    }
    const start = rule.start
    const stop = rule.stop

    if (start !== null && start !== undefined && valueLength < start) {
      continue
    }

    const startIdx = start ? start - 1 : 0
    const stopIdx = stop ? stop - 1 : values.length - 1

    for (let i = startIdx; i < valueLength && i <= stopIdx; i++) {
      values.splice(i, 1, '*')
    }
  }

  return values.join('')
}
