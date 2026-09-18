/**
 * 将一个或多个源对象复制到目标对象中（移植自旧 src/object/assign.js）
 *
 * 忠实旧语义（fixtures/object/assign.json 锁定）：
 * - 常规模式走 Object.assign（浅合并、后者覆盖、null 源跳过）；
 * - 怪癖：首参传 true 且带源对象时进入"深拷贝模式"——目标重置为
 *   （源 1 为数组则 [] 否则 {}），逐源按键以 clone(value, true) 深拷贝写入，
 *   同名嵌套对象整键替换而非递归合并；
 * - falsy 目标（含首参 true 但无源对象）原样返回。
 */
import { arrayEach } from '../internal/iterate'
import { isArray } from '../internal/type'
import { clone } from './clone'

/**
 * 逐源复制（深拷贝模式下每个键值经 clone(value, true) 写入）
 *
 * @param destination 目标对象
 * @param args 完整参数列表（args[0] 为目标，从 args[1] 起为源）
 * @param isClone 是否深拷贝模式
 */
function handleAssign(destination: Record<PropertyKey, unknown>, args: unknown[], isClone: boolean): unknown {
  const len = args.length
  for (let index = 1; index < len; index++) {
    const source = args[index] as Record<string, unknown> | null | undefined
    arrayEach(source ? Object.keys(source) : [], (key: string) => {
      const value = source ? source[key] : undefined
      destination[key] = isClone ? clone(value, isClone) : value
    })
  }
  return destination
}

/**
 * 将一个或多个源对象复制到目标对象中
 *
 * @param target 目标对象；传 true 时进入深拷贝模式（返回全新对象）
 * @param sources 源对象列表
 * @returns 目标对象（深拷贝模式返回新对象；falsy 目标原样返回）
 */
export function assign(target: unknown, ...sources: unknown[]): unknown {
  if (target) {
    if (target === true) {
      if (sources.length > 0) {
        const dest = isArray(sources[0]) ? [] : {}
        return handleAssign(dest as Record<PropertyKey, unknown>, [target, ...sources], true)
      }
    } else {
      return Object.assign
        ? Object.assign(target as object, ...sources)
        : handleAssign(target as Record<PropertyKey, unknown>, [target, ...sources], false)
    }
  }
  return target
}
