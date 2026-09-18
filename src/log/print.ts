/**
 * 打印原子操作（移植自旧 src/log/utils.js 的 isEmpty/formatPrint）
 *
 * 输出走 console（node/浏览器都有）；颜色分支：
 * - 浏览器：保留旧版 %c 样式串（样式文本逐字保留）；
 * - node：ANSI 转义（主题色 hex 按 256 色立方/灰阶量化取近似码，徽章文字用亮白 97）。
 */
import { isBrowser } from '../internal/env'

const RESET = '\u001b[0m'
const BRIGHT_WHITE = '\u001b[97m'

/** hex(#RRGGBB) → ANSI 256 色码（立方量化；r=g=b 走灰阶，两端截断到 16/231） */
function hexToAnsi256(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  if (r === g && g === b) {
    if (r < 8) {
      return 16
    }
    if (r > 248) {
      return 231
    }
    return Math.round(((r - 8) / 247) * 24) + 232
  }
  return 16 + 36 * Math.round((r / 255) * 5) + 6 * Math.round((g / 255) * 5) + Math.round((b / 255) * 5)
}

/** 是否为空（旧 log/utils.js 的 isEmpty：null/undefined/'' 为空，仅本域使用，与 basic.isEmpty 语义不同） */
export function logIsEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

/** 浏览器 %c 徽章样式（旧版样式串逐字保留） */
export function browserBadgeStyle(color: string): string {
  return `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`
}

/** node ANSI 徽章（主题色背景 + 亮白文字，两侧留空格与旧 %c 版式一致） */
export function ansiBadge(title: string, color: string): string {
  return `\u001b[48;5;${hexToAnsi256(color)}m${BRIGHT_WHITE} ${title} ${RESET}`
}

/**
 * 格式打印（旧 formatPrint）：标题徽章 + 文本/对象
 * 对象内容：浏览器走 %o（旧版），node 走 %o（util.inspect）；
 * 文本内容：浏览器双 %c 分段（旧版），node ANSI 前景色。
 */
export function formatPrint(title: unknown, text: unknown, color: string): void {
  if (isBrowser) {
    if (typeof text === 'object' && text !== null) {
      console.log(`%c ${title} %o`, browserBadgeStyle(color), text)
    } else {
      console.log(
        `%c ${title} %c ${text} %c`,
        browserBadgeStyle(color),
        `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
        'background:transparent;',
      )
    }
    return
  }
  const badge = ansiBadge(String(title), color)
  if (typeof text === 'object' && text !== null) {
    console.log(`${badge} %o`, text)
    return
  }
  console.log(`${badge} \u001b[38;5;${hexToAnsi256(color)}m ${String(text)} ${RESET}`)
}
