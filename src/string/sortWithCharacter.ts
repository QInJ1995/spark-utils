/**
 * 按拼音 / 字母排序（移植自旧 src/string/sortWithCharacter.js）
 *
 * - localeCompare 以 numeric: true（数字按数值比较：[10,2,1,20] → [1,2,10,20]）、
 *   sensitivity: 'base'（忽略大小写）排序；
 * - rule 为 DescOrAsc.desc 时降序（比较值取 0 - result）；
 * - 原地排序并返回原数组（Array#sort 语义），空数组返回空数组。
 *
 * 默认参数归一（locale ?? 'zh'、rule ?? asc）与旧版二次 ?? 兜底等价，
 * 改为读取局部量，不再原地改写入参 option（行为等价）。
 */
import { DescOrAsc } from './descOrAsc'

/** 排序选项 */
export interface SortWithCharacterOption {
  /** localeCompare 语言区域，缺省 'zh' */
  locale?: string
  /** 排序方向，缺省升序（DescOrAsc.asc） */
  rule?: DescOrAsc
}

/** 按拼音 / 字母排序（原地排序，返回原数组） */
export function sortWithCharacter<T extends { toString(): string }>(
  data: T[],
  option: SortWithCharacterOption = {},
): T[] {
  const locale = option.locale ?? 'zh'
  const rule = option.rule ?? DescOrAsc.asc
  return data.sort((a, b) => {
    const result = a.toString().localeCompare(b.toString(), locale, {
      numeric: true,
      sensitivity: 'base',
    })
    if (rule === DescOrAsc.desc) {
      return 0 - result
    }
    return result
  })
}
