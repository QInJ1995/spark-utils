import { arrayEach } from '../internal/iterate'
import { eqNull } from '../internal/type'
import { pluck } from './pluck'

/**
 * 与 zip 相反（移植自旧 src/array/unzip.js）
 *
 * - 以最长子项为准逐位取值（pluck 按位抽取，缺位为 undefined）；
 * - 旧 number/max.js 在此场景的内联：按 item ? item.length : 0 求最大，
 *   返回的是长度最大的原数组项（非长度值），平局保留首个；
 * - 空入参/空数组返回 []。
 *
 * @param arrays 数组集合
 * @returns 按位解包结果
 */
export function unzip(arrays: ReadonlyArray<unknown> | null | undefined): unknown[][] {
  const result: unknown[][] = []
  if (arrays && arrays.length) {
    const list = arrays as unknown[]
    let maxLength: unknown
    let maxIndex: number | undefined
    arrayEach(list, function maxByLength(item, index) {
      const val = item ? (item as { length?: unknown }).length : 0
      if (!eqNull(val) && (eqNull(maxLength) || (maxLength as number) < (val as number))) {
        maxIndex = index
        maxLength = val
      }
    })
    // 与旧版 arr[itemIndex] 一致：index 必已被记录（首项 length 即可为 0）
    const maxItem = maxIndex === undefined ? undefined : list[maxIndex]
    const len = maxItem ? ((maxItem as { length?: unknown }).length as number) : 0
    for (let index = 0; index < len; index++) {
      result.push(pluck(list, index))
    }
  }
  return result
}
