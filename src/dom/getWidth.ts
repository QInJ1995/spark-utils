// 获取元素宽度
export function getWidth (el) {
  let wd
  const rect = el.getBoundingClientRect()
  if (rect.width) {
    wd = rect.width
  } else {
    wd = rect.right - rect.left
  }
  return wd
}

export default getWidth
