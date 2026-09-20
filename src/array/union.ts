import { toArray } from './toArray'
import { uniq } from './uniq'

/**
 * 将多个数的值返回唯一的并集数组（移植自旧 src/array/union.js）
 *
 * 逐个参数 toArray 后 concat 合并，再 uniq 去重；
 * 字符串参数会被 toArray 拆成字符（怪癖忠实保留，fixture 锁定）。
 *
 * @param arrays 数组列表
 * @returns 唯一化的并集数组
 */
export function union(...arrays: ReadonlyArray<unknown>[]): unknown[] {
  let result: unknown[] = []
  for (let index = 0; index < arrays.length; index++) {
    result = result.concat(toArray(arrays[index]))
  }
  return uniq(result)
}
