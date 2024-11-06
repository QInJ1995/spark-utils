import setupDefaults from '../constant/setup/setupDefaults'
/**
 * @description: 是否为空
 * @param {*} value
 * @return {*}
 */
export const isEmpty = function(value) {
  return value == null || value === undefined || value === '';
}

/**
 * @description: 判断是否生产环境
 * @return {*}
 */
export const isShowLog =  function() {
  // 生产环境可以显示打印内容开关
  let curWindow = window
  while (!curWindow.showLog && curWindow !== curWindow.parent) {
    curWindow = curWindow.parent
  }
  if (curWindow.showLog) {
    return true
  }  else {
    return setupDefaults.showLog
  }
 
}

/**
 * @description: 格式打印 
 * @param {*} title 打印标题
 * @param {*} text 打印文本
 * @param {*} color 打印颜色
 * @return {*}
 */
export const formatPrint = function(title, text, color) {
  if (!isShowLog()) return;
  console.log(
    `%c ${title} %c ${text} %c`,
    `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
    `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
    'background:transparent'
  );
}