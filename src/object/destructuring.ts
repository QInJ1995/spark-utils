/**
 * 将一个或者多个对象值解构到目标对象（移植自旧 src/object/destructuring.js）
 *
 * 用途：解构赋值辅助——以 assign({}, ...sources) 汇总所有源对象后，
 * 仅把与目标已有键相交的键覆盖回目标（不引入新键）。
 *
 * 忠实旧语义（fixtures/object/destructuring.json 锁定）：
 * - 目标与"第一个源"均 truthy 才执行（旧版守卫读 arguments[1]，
 *   故第二参 falsy 时整体跳过、原样返回目标）；
 * - 多源按序覆盖；无交集不变；falsy 目标原样返回。
 */
import { assign } from './assign'

/**
 * 将一个或者多个对象值解构到目标对象（仅覆盖相交键）
 *
 * @param destination 目标对象
 * @param sources 源对象列表（取第一个源做 truthy 守卫）
 * @returns 目标对象
 */
export function destructuring(destination: unknown, ...sources: unknown[]): unknown {
  const first = sources[0]
  if (destination && first) {
    const rest = assign({}, ...sources) as Record<string, unknown>
    const restKeys = Object.keys(rest)
    const target = destination as Record<string, unknown>
    for (const key of Object.keys(target)) {
      if (restKeys.includes(key)) {
        target[key] = rest[key]
      }
    }
  }
  return destination
}
