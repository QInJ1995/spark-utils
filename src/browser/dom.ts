/**
 * browser/dom —— DOM 元素信息（M5：自旧 src/dom/{getStyle,getWidth,getHeight}.js 重写）
 *
 * 重写说明：
 * - 旧 dom/ 目录实际只有 getStyle/getWidth/getHeight 三个方法
 *  （index.js 仅聚合），并无 textContent/offset 族实现，故 2.0 不虚构 API。
 * - getStyle 删除 IE 的 currentStyle 分支（2.0 破坏点），统一走
 *   defaultView.getComputedStyle；document 访问经 internal/env 惰性求值。
 * - 数值解析用 Number.parseInt（与旧 parseInt 全局语义一致）。
 */
import { getDocument } from '../internal/env'

/**
 * 获取元素样式（旧 src/dom/getStyle.js）
 * @param el 元素节点
 * @param attr 样式属性名（'padding-top' / 'paddingTop' 两种写法均可）
 * @returns 样式值；无 document/defaultView 时返回空串
 */
export function getStyle(el: Element, attr: string): string {
  const doc = getDocument<Document>()
  const view = doc?.defaultView
  if (!view) {
    return ''
  }
  // 旧版为 computed[attr] 索引访问，驼峰（paddingTop）与连字符（padding-top）写法
  // 均可命中；getPropertyValue 仅认连字符写法，故先做驼峰归一再查询（已含连字符
  // 或非标准名则原样透传，与旧版索引访问一致）
  const kebab = attr.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
  return view.getComputedStyle(el, null).getPropertyValue(kebab)
}

/** 解析样式值为数字（'10px' -> 10；空/非数值返回 0，忠实旧版 || 0 兜底） */
function parseCssValue(el: Element, attr: string): number {
  return Number.parseInt(getStyle(el, attr), 10) || 0
}

/**
 * 获取元素宽度（旧 src/dom/getWidth.js）
 * @param el 元素节点
 */
export function getWidth(el: Element): number {
  const rect = el.getBoundingClientRect()
  return rect.width || rect.right - rect.left
}

/**
 * 获取元素高度（旧 src/dom/getHeight.js）
 * @param el 元素节点
 * @param innerHeight 传 true 时扣除上下内边距与边框（内容高度）
 */
export function getHeight(el: Element, innerHeight?: boolean): number {
  const rect = el.getBoundingClientRect()
  let ht = rect.height || rect.bottom - rect.top
  if (innerHeight) {
    const paddingTop = parseCssValue(el, 'padding-top')
    const paddingBottom = parseCssValue(el, 'padding-bottom')
    const borderBottom = parseCssValue(el, 'border-bottom')
    const borderTop = parseCssValue(el, 'border-top')
    ht = ht - paddingTop - paddingBottom - borderBottom - borderTop
  }
  return ht
}
