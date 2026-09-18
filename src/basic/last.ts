/**
 * 获取对象最后一个值（旧 src/basic/last.js）
 *
 * 旧实现为 values(obj)[list.length - 1]；keys/values/entries 已从 2.0
 * 公共 API 删除（原生镜像），此处按旧 values 在现代环境的等价形态内联
 * （Object.values 原样返回；字符串入参得字符数组——怪癖保留）。
 */

/**
 * 获取对象最后一个值
 *
 * @param obj 对象/数组
 * @returns 最后一个值（空值/空集合为 undefined）
 */
export function last(obj: unknown): unknown {
  const list = obj ? Object.values(obj as object) : []
  return list[list.length - 1]
}
