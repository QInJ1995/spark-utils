import { getStyle } from './getStyle'

// 获取元素高度
export function getHeight (el, innerHeight) {
  let ht
  const rect = el.getBoundingClientRect()
  if (rect.height) {
    ht = rect.height
  } else {
    ht = rect.bottom - rect.top
  }
  if (innerHeight) {
    const p1 = parseInt(getStyle(el, 'padding-top')) || 0
    const p2 = parseInt(getStyle(el, 'padding-bottom')) || 0
    const b1 = parseInt(getStyle(el, 'border-bottom')) || 0
    const b2 = parseInt(getStyle(el, 'border-top')) || 0
    ht = ht - p1 - p2 - b1 - b2
  }
  return ht
}
export default getHeight
