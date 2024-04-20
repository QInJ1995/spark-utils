'use strict'

var doc = window.document
var copyElem

function handleText (content) {
  if (!copyElem) {
    copyElem = doc.createElement('textarea')
    copyElem.id = '$TaUtilClipBoardCopy'
    var styles = copyElem.style
    styles.width = '48px'
    styles.height = '24px'
    styles.position = 'fixed'
    styles.zIndex = '0'
    styles.left = '-500px'
    styles.top = '-500px'
    doc.body.appendChild(copyElem)
  }
  copyElem.value = (content === null || content === undefined) ? '' : ('' + content)
}

/**
 * 复制内容到剪贴板
 *
 * @param {String | Number} content Text 内容
 */
export function copyText (content) {
  var result = false
  try {
    handleText(content)
    copyElem.focus()
    copyElem.select()
    copyElem.setSelectionRange(0, copyElem.value.length)
    result = doc.execCommand('copy')
  } catch (e) {}
  return result
}
