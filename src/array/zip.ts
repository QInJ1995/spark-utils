import { unzip } from './unzip'

/**
 * 将每个数组中相应位置的值合并在一起（移植自旧 src/array/zip.js）
 *
 * 旧版为 unzip(arguments)；rest 参数收集后等价传入。
 *
 * @param arrays 数组列表
 * @returns 按位合并结果（以最长数组为准，缺位为 undefined）
 */
export function zip(...arrays: ReadonlyArray<unknown>[]): unknown[][] {
  return unzip(arrays)
}
