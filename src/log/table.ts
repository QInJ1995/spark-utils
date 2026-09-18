/**
 * table 打印（移植自旧 src/log/table.js）
 *
 * 内容为非 null 对象（含数组）时：console.groupCollapsed 折叠徽章 + console.table + groupEnd；
 * 否则不输出任何内容（旧版即如此，注释掉的旧手绘表格代码不移植）。
 * 徽章样式走 print.ts 的浏览器 %c / node ANSI 分支（旧色值 #BA7A57 保留）。
 */
import { isBrowser } from '../internal/env'
import { isShowLog } from './isShowLog'
import { ansiBadge, browserBadgeStyle, logIsEmpty } from './print'

const TABLE_COLOR = '#BA7A57'

/** table 打印：对象/数组以折叠分组 + 表格形式输出 */
export function table(textOrTitle: unknown, content?: unknown): void {
  if (!isShowLog()) {
    return
  }
  const isSingle = logIsEmpty(content)
  const title = isSingle ? 'Table' : textOrTitle
  const text = isSingle ? textOrTitle : content
  if (typeof text === 'object' && text !== null) {
    if (isBrowser) {
      console.groupCollapsed(`%c ${title} `, browserBadgeStyle(TABLE_COLOR))
    } else {
      console.groupCollapsed(ansiBadge(String(title), TABLE_COLOR))
    }
    console.table(text)
    console.groupEnd()
  }
}
