/**
 * 将驼峰字符串转成短横线字符串（移植自旧 src/string/kebabCase.js）
 *
 * 例如：projectName → project-name。怪癖忠实保留
 * （见 test/fixtures/string/kebabCase.json）：
 * - 连续大写断点（XMLHttpRequest → xml-http-request）；
 * - 数字入参返回其字符串形式（123 → "123"）；
 * - 带结果缓存（模块级，命中 falsy 缓存值时按未命中重算，与旧版一致）。
 */
import { helperStringLowerCase, helperStringSubstring } from '../internal/string'
import { toValueString } from './toValueString'

/** 短横线结果缓存（旧 kebabCacheMaps） */
const kebabCacheMaps: Record<string, string> = {}

/** 将驼峰字符串转成短横线（kebab-case）字符串 */
export function kebabCase(str: unknown): string {
  const value = toValueString(str)
  if (kebabCacheMaps[value]) {
    return kebabCacheMaps[value]
  }
  let rest = value
    .replace(/^([a-z])([A-Z]+)([a-z]+)$/, (text: string, prevLower: string, upper: string, nextLower: string) => {
      const upperLen = upper.length
      if (upperLen > 1) {
        return (
          prevLower +
          '-' +
          helperStringLowerCase(helperStringSubstring(upper, 0, upperLen - 1)) +
          '-' +
          helperStringLowerCase(helperStringSubstring(upper, upperLen - 1, upperLen)) +
          nextLower
        )
      }
      return helperStringLowerCase(prevLower + '-' + upper + nextLower)
    })
    .replace(/^([A-Z]+)([a-z]+)?$/, (text: string, upper: string, nextLower: string) => {
      return helperStringLowerCase(upper + (nextLower || ''))
    })
    .replace(/([a-z]?)([A-Z]+)([a-z]?)/g, (text: string, prevLower: string, upper: string, nextLower: string, index: number) => {
      const upperLen = upper.length
      if (upperLen > 1) {
        let prefix = prevLower
        if (prefix) {
          prefix += '-'
        }
        if (nextLower) {
          return (
            (prefix || '') +
            helperStringLowerCase(helperStringSubstring(upper, 0, upperLen - 1)) +
            '-' +
            helperStringLowerCase(helperStringSubstring(upper, upperLen - 1, upperLen)) +
            nextLower
          )
        }
      }
      return (prevLower || '') + (index ? '-' : '') + helperStringLowerCase(upper) + (nextLower || '')
    })
  rest = rest.replace(/([-]+)/g, (text: string, flag: string, index: number) => {
    return index && index + flag.length < rest.length ? '-' : ''
  })
  kebabCacheMaps[value] = rest
  return rest
}
