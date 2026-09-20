/**
 * 字符串内部原子操作（L0）
 *
 * 移植自旧版：
 * - src/helpers/helperStringRepeat.js / helperStringSubstring.js
 * - src/helpers/helperStringLowerCase.js / helperStringUpperCase.js
 * - src/constant/static/staticEscapeMap.js（escape/unescape 的映射）
 * - src/helpers/helperFormatEscaper.js（escape/unescape 的工厂）
 *
 * L0 约束：不依赖 internal 其他目录、不依赖旧 src/*.js，本文件无内部依赖。
 */

/** 重复字符串（旧 helperStringRepeat；现代环境恒走 str.repeat 分支，降级分支忠实保留） */
export function helperStringRepeat(str: string, count: number): string {
  if (str.repeat) {
    return str.repeat(count)
  }
  // 旧实现为 new Array(staticParseInt(count))；此处 parseInt(String(count)) 与其一致
  const list = isNaN(count) ? [] : new Array(parseInt(String(count)))
  return list.join(str) + (list.length > 0 ? str : '')
}

/** 截取字符串（旧 helperStringSubstring） */
export function helperStringSubstring(str: string, start: number, end?: number): string {
  return str.substring(start, end)
}

/** 转小写（旧 helperStringLowerCase） */
export function helperStringLowerCase(str: string): string {
  return str.toLowerCase()
}

/** 转大写（旧 helperStringUpperCase） */
export function helperStringUpperCase(str: string): string {
  return str.toUpperCase()
}

/** HTML 转义映射（旧 staticEscapeMap），键序即正则备选顺序，保持旧版插入序 */
export const escapeMap: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
}

/** 反向转义映射（旧 src/string/unescape.js 中由 staticEscapeMap 反转构建） */
export const unescapeMap: Readonly<Record<string, string>> = (() => {
  const map: Record<string, string> = {}
  for (const [key, value] of Object.entries(escapeMap)) {
    map[value] = key
  }
  return map
})()

/**
 * 转义/反转义工厂（旧 helperFormatEscaper）：
 * 由映射的键构造全局正则，对取串后的输入做整体替换。
 *
 * 与旧实现的差异（L0 分层要求）：旧版内部调用 toValueString（公共 API，属
 * M3 string 模组）做取串，此处不能依赖，改用内置的等价取串——null/undefined
 * 归 ''，其余 String() 取串。对字符串及非科学计数法数值与旧版完全等价；
 * 旧版 escape/unescape 的完整行为（含科学计数法数值的展开）由 M3 以前置
 * toValueString 组合还原：escape(str) === formatEscaper(escapeMap)(toValueString(str))。
 */
export function formatEscaper(dataMap: Readonly<Record<string, string>>): (str: unknown) => string {
  const replaceRegexp = new RegExp('(?:' + Object.keys(dataMap).join('|') + ')', 'g')
  return function (str: unknown): string {
    return toEscaperString(str).replace(replaceRegexp, (match) => dataMap[match] ?? match)
    // dataMap[match] 必然存在（正则由键构造）；?? match 仅作类型收窄的兜底
  }
}

function toEscaperString(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value)
}
