/**
 * 将字符串转成驼峰字符串（移植自旧 src/string/camelCase.js）
 *
 * 例如：project-name → projectName。怪癖忠实保留
 * （见 test/fixtures/string/camelCase.json）：
 * - 连续大写段（PROJECTName → projectName，'N' 计入大写段）；
 * - 'PROJECT-Name' → 'projecTName'（连字符打断大写段后的边界怪癖）；
 * - 空串原样返回；带结果缓存（模块级，命中 falsy 缓存值时按未命中重算，与旧版一致）。
 */
import {
  helperStringLowerCase,
  helperStringSubstring,
  helperStringUpperCase,
} from '../internal/string'
import { toValueString } from './toValueString'

/** 驼峰结果缓存（旧 camelCacheMaps） */
const camelCacheMaps: Record<string, string> = {}

/** 将带分隔符 / 大写的字符串转成驼峰字符串 */
export function camelCase(str: unknown): string {
  const value = toValueString(str)
  if (camelCacheMaps[value]) {
    return camelCacheMaps[value]
  }
  let strLen = value.length
  let rest = value.replace(/([-]+)/g, (text: string, flag: string, index: number) => {
    return index && index + flag.length < strLen ? '-' : ''
  })
  strLen = rest.length
  rest = rest
    .replace(/([A-Z]+)/g, (text: string, upper: string, index: number) => {
      const upperLen = upper.length
      const lowerUpper = helperStringLowerCase(upper)
      if (index) {
        if (upperLen > 2 && index + upperLen < strLen) {
          return (
            helperStringUpperCase(helperStringSubstring(lowerUpper, 0, 1)) +
            helperStringSubstring(lowerUpper, 1, upperLen - 1) +
            helperStringUpperCase(helperStringSubstring(lowerUpper, upperLen - 1, upperLen))
          )
        }
        return (
          helperStringUpperCase(helperStringSubstring(lowerUpper, 0, 1)) +
          helperStringSubstring(lowerUpper, 1, upperLen)
        )
      }
      if (upperLen > 1 && index + upperLen < strLen) {
        return (
          helperStringSubstring(lowerUpper, 0, upperLen - 1) +
          helperStringUpperCase(helperStringSubstring(lowerUpper, upperLen - 1, upperLen))
        )
      }
      return lowerUpper
    })
    .replace(/(-[a-zA-Z])/g, (text: string, upper: string) => {
      return helperStringUpperCase(helperStringSubstring(upper, 1, upper.length))
    })
  camelCacheMaps[value] = rest
  return rest
}
