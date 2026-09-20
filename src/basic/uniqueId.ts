/**
 * 获取一个全局唯一标识（旧 src/basic/uniqueId.js）
 *
 * 模块级自增计数器（旧实现为文件内 __uniqueId）；无快照基线
 * （方法保留、fixture 排除），语义与旧版一致：每次调用自增，
 * [prefix, ++id].join('')（undefined 前缀经 join 得纯数字串）。
 */

let uniqueIdCounter = 0

/**
 * 获取一个全局唯一标识
 *
 * @param prefix 前缀
 * @returns 唯一标识
 */
export function uniqueId(prefix?: string): string {
  return [prefix, ++uniqueIdCounter].join('')
}
