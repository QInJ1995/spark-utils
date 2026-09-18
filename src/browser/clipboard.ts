/**
 * browser/clipboard —— 剪贴板复制（M5：自旧 src/browser/clipboard.js 重写）
 *
 * 重写说明：
 * - 优先使用异步 Clipboard API（navigator.clipboard.writeText），
 *   不可用或失败时回退到旧版的隐藏 textarea + document.execCommand('copy')。
 * - 返回值由旧版的同步 boolean 改为 Promise<boolean>（2.0 破坏点：
 *   Clipboard API 本身是异步的）。
 * - window/document 访问经 internal/env 惰性求值；非浏览器环境返回 false。
 */
import { getDocument, getWindow } from '../internal/env'

/** 旧版隐藏输入框（模块级复用，属性与旧版一致） */
let copyElem: HTMLTextAreaElement | undefined

/** 创建/复用隐藏 textarea 并写入内容（旧 handleText） */
function handleText(doc: Document, content: unknown): HTMLTextAreaElement {
  if (!copyElem) {
    copyElem = doc.createElement('textarea')
    copyElem.id = '$TaUtilClipBoardCopy'
    const styles = copyElem.style
    styles.width = '48px'
    styles.height = '24px'
    styles.position = 'fixed'
    styles.zIndex = '0'
    styles.left = '-500px'
    styles.top = '-500px'
    doc.body.appendChild(copyElem)
  }
  copyElem.value = content === null || content === undefined ? '' : `${content}`
  return copyElem
}

/** 旧版同步复制路径：隐藏 textarea + execCommand('copy') */
function copyTextLegacy(doc: Document, content: unknown): boolean {
  try {
    const elem = handleText(doc, content)
    elem.focus()
    elem.select()
    elem.setSelectionRange(0, elem.value.length)
    return doc.execCommand('copy')
  } catch {
    return false
  }
}

/**
 * 复制内容到剪贴板
 * @param content 文本内容（null/undefined 归空串）
 * @returns 是否复制成功
 */
export async function copyText(content: unknown): Promise<boolean> {
  const win = getWindow() as Window | undefined
  const doc = getDocument() as Document | undefined
  if (!win || !doc) {
    return false
  }
  const text = content === null || content === undefined ? '' : `${content}`
  const clipboard = win.navigator.clipboard
  if (clipboard && typeof clipboard.writeText === 'function') {
    try {
      await clipboard.writeText(text)
      return true
    } catch {
      // 权限被拒等场景回退到 execCommand 路径
    }
  }
  return copyTextLegacy(doc, content)
}
