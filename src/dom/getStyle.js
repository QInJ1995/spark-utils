// 获取元素样式 obj dom节点  attr属性例如  padding margin等
export function getStyle (obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[ attr ]
  } else {
    return document.defaultView.getComputedStyle(obj, null)[ attr ]
  }
}

export default getStyle
