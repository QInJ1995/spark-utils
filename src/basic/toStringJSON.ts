import { isPlainObject, isString } from '../internal/type'

/**
 * 字符串转 JSON（旧 src/basic/toStringJSON.js）
 *
 * 怪癖忠实保留（fixture 锁定）：普通对象入参原样返回（数组不是普通对象，
 * 走 JSON.parse 分支）；解析失败静默回退 {}；JSON.parse("null") 得 null
 * 原样返回；非字符串非普通对象回退 {}。
 */

/**
 * 字符串转 JSON
 *
 * @param str 字符串
 * @returns 返回转换后的对象
 */
export function toStringJSON(str: unknown): unknown {
  if (isPlainObject(str)) {
    return str
  }
  if (isString(str)) {
    try {
      return JSON.parse(str)
    } catch {
      // 旧实现：解析失败静默吞掉，回退 {}
    }
  }
  return {}
}
