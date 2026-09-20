/**
 * 将一个或多个源对象合并到目标对象中（移植自旧 src/object/merge.js）
 *
 * 忠实旧语义（fixtures/object/merge.json 锁定）：
 * - 仅"普通对象+普通对象"或"数组+数组"同型时递归深合并（逐键
 *   target[key] = handleMerge(target[key], source[key])，数组按索引合并）；
 * - 其余情形（含单侧为标量/日期等）直接以源值整体替换；
 * - falsy 目标初始化为 {}；falsy 源跳过；返回目标对象。
 */
import { each } from '../internal/iterate'
import { isArray, isPlainObject } from '../internal/type'

/**
 * 单个源的合并：同型（普通对象/数组）递归深合并，否则以源值替换
 *
 * @param target 目标值
 * @param source 源值
 */
function handleMerge(target: unknown, source: unknown): unknown {
  if ((isPlainObject(target) && isPlainObject(source)) || (isArray(target) && isArray(source))) {
    const dest = target as Record<PropertyKey, unknown>
    each(source, (srcVal: unknown, key: string | number) => {
      dest[key] = handleMerge(dest[key], srcVal)
    })
    return target
  }
  return source
}

/**
 * 将一个或多个源对象合并到目标对象中
 *
 * @param target 目标对象（falsy 时初始化为 {}）
 * @param sources 源对象列表（falsy 源跳过）
 * @returns 目标对象
 */
export function merge(target: unknown, ...sources: unknown[]): unknown {
  let dest = target
  if (!dest) {
    dest = {}
  }
  for (const source of sources) {
    if (source) {
      handleMerge(dest, source)
    }
  }
  return dest
}
