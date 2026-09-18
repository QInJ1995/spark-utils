/**
 * 转义 HTML 字符串（移植自旧 src/string/escape.js）
 *
 * 替换 & < > " ' ` 六个保留字符，映射与顺序取自 internal/string 的 escapeMap
 * （旧 staticEscapeMap）。旧 helperFormatEscaper 内部先经 toValueString 取串
 * （数值入参同样处理：escape(123) → "123"、escape(1e21) 展开），此处按
 * internal 层约定组合还原：escape(str) === formatEscaper(escapeMap)(toValueString(str))。
 *
 * 怪癖忠实保留（见 test/fixtures/string/escape.json）：二次转义时 & 再次转义
 * （escape('&lt;') → '&amp;lt;'）。
 */
import { escapeMap, formatEscaper } from '../internal/string'
import { toValueString } from './toValueString'

/** 转义处理器（模块加载期构造一次：由映射键组成全局正则 + 整体替换） */
const escapeHandle: (str: unknown) => string = formatEscaper(escapeMap)

/** 转义 HTML 字符串，替换 & < > " ' ` 字符 */
export function escape(str: unknown): string {
  return escapeHandle(toValueString(str))
}
