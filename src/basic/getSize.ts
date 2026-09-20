import { each } from '../internal/iterate'
import { isArray, isString } from '../internal/type'

/**
 * 返回对象的长度（旧 src/basic/getSize.js）
 *
 * 字符串/数组取 length；其余经 each 计数（对象按自有可枚举键数），
 * falsy 入参计数为 0。
 */

/**
 * 返回对象的长度
 *
 * @param obj 对象
 * @returns 长度
 */
export function getSize(obj: unknown): number {
  let len = 0
  if (isString(obj) || isArray(obj)) {
    return obj.length
  }
  each(obj, () => {
    len++
  })
  return len
}
