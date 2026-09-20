/**
 * 反转义 HTML 字符串（移植自旧 src/string/unescape.js）
 *
 * 反向映射由 escapeMap 反转构建（internal/string 的 unescapeMap，键序与旧版
 * each(staticEscapeMap) 的 for-in 插入序一致），同样前置 toValueString 取串。
 *
 * 怪癖忠实保留（见 test/fixtures/string/unescape.json）：单次解码只解一层
 * （unescape('&amp;lt;') → '&lt;'）。
 */
import { formatEscaper, unescapeMap } from '../internal/string'
import { toValueString } from './toValueString'

/** 反转义处理器（模块加载期构造一次） */
const unescapeHandle: (str: unknown) => string = formatEscaper(unescapeMap)

/** 反转义 HTML 字符串（escape 的逆操作，单层解码） */
export function unescape(str: unknown): string {
  return unescapeHandle(toValueString(str))
}
