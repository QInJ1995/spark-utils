/**
 * getCurDateTime / getCurDateFullTime 的公共前缀提取（旧 src/date/baseGetCurDateTime.js）
 *
 * 内部依赖文件：拼装 `YYYY-MM-DD HH:mm:` 前缀（不含秒），
 * 仅供 date 域内使用，不进入模块出口（旧版亦未在 index.js 导出）。
 */

/**
 * 拼接日期时间前缀（到分钟冒号为止）
 *
 * @param d 当前时间
 * @returns `YYYY-MM-DD HH:mm:`
 */
export function baseGetCurDateTime(d: Date): string {
  let ret = d.getFullYear() + '-'
  ret += ('00' + (d.getMonth() + 1)).slice(-2) + '-'
  ret += ('00' + d.getDate()).slice(-2) + ' '
  ret += ('00' + d.getHours()).slice(-2) + ':'
  ret += ('00' + d.getMinutes()).slice(-2) + ':'
  return ret
}
