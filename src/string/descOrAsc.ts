/**
 * 排序方向枚举（移植自旧 src/string/descOrAsc.js）
 *
 * 内部模块：sortWithCharacter 依赖，不进 index.ts 具名导出。
 */

/** 排序方向（desc = 0 降序，asc = 1 升序，成员值与旧版一致） */
export const DescOrAsc = Object.freeze({
  desc: 0,
  asc: 1,
} as const)

/** 排序方向类型 */
export type DescOrAsc = (typeof DescOrAsc)[keyof typeof DescOrAsc]
