import { eqNull } from '../internal/type'

/**
 * JSON 转字符串（旧 src/basic/toJSONString.js）
 *
 * 怪癖忠实保留：undefined/null 入参返回 ''；值中含 undefined 的键被
 * JSON.stringify 丢弃（{a: undefined} => '{}'）。
 */

/**
 * JSON 转字符串
 *
 * @param obj 对象
 * @returns 返回字符串
 */
export function toJSONString(obj: unknown): string {
  return eqNull(obj) ? '' : JSON.stringify(obj)
}
