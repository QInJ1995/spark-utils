/**
 * 获取对象第一个值（旧 src/basic/first.js）
 *
 * 旧实现为 values(obj)[0]；keys/values/entries 已从 2.0 公共 API 删除
 * （原生镜像），此处按旧 values 在现代环境的等价形态内联：
 * Object.values 存在时原样返回（字符串入参得字符数组——怪癖保留），
 * falsy 入参为 []，故取值结果为 undefined。
 */

/**
 * 获取对象第一个值
 *
 * @param obj 对象/数组
 * @returns 第一个值（空值/空集合为 undefined；字符串入参得首字符）
 */
export function first<T = unknown>(
  obj: Record<string, T> | ReadonlyArray<T> | string | null | undefined
): T | undefined {
  const list = obj ? Object.values(obj as object) : []
  return list[0] as T | undefined
}
