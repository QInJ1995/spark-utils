/**
 * 路径键正则（移植自 src/constant/static/staticHGKeyRE.js，
 * src/constant/RegEx/staticHGKeyRE.js 内容相同，合并为一份导出）。
 * 用于 get/has/set 中探测 "a.b[2]" 形式的数组下标路径。
 */
export const staticHGKeyRE = /(.+)?\[(\d+)\]$/

/**
 * 解析属性路径为键数组（移植自 src/helpers/helperGetHGSKeys.js）
 *
 * 忠实旧语义：
 * - falsy 返回 []；
 * - 同时具备 splice 与 join（最快数组探测，可忽略准确性）直接返回原数组引用（不拷贝）；
 * - 其余按 '' + property 字符串化后以 '.' 拆分。
 *
 * @param property 属性路径（点分字符串或字符串数组）
 * @returns 键数组
 */
export function getHGSKeys(property: string | readonly string[] | null | undefined): string[] {
  if (property) {
    const prop = property as unknown as { splice?: unknown; join?: unknown }
    if (prop.splice && prop.join) {
      return property as unknown as string[]
    }
    return ('' + property).split('.')
  }
  return []
}
