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
export const isProduction =  function() {
  // 在生成环境可以显示打印内容
  let curWindow = window
  while (!curWindow.showLog && curWindow !== curWindow.parent) {
    curWindow = curWindow.parent
  }
  if (curWindow.showLog) return false
  let isProduction = false 
  if (process.env.NODE_ENV) { // webpack 判断
    isProduction = process.env.NODE_ENV === 'production'
  } else { // vite判断
    isProduction = import.meta.env.MODE === 'production'
  }
  return isProduction
}

/**
 * @description: 格式打印 
 * @param {*} title 打印标题
 * @param {*} text 打印文本
 * @param {*} color 打印颜色
 * @return {*}
 */
export const formatPrint = function(title, text, color) {
  if (isProduction()) return;
  console.log(
    `%c ${title} %c ${text} %c`,
    `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
    `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
    'background:transparent'
  );
}