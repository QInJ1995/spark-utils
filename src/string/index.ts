/**
 * string 模块入口（M3：自旧 src/string/*.js 严格 TS 重写）
 *
 * 具名导出 12 个方法。内部化不导出：
 * - toValueString（以别名 toString 导出，与其余模块 toString 语义对齐）；
 * - ruleLib / descOrAsc 常量（脱敏与排序内部依赖；DescOrAsc 类型随
 *   sortWithCharacter 的 option 类型一并导出）；
 * - pinyin（字典大、独立分包，经 src/pinyin.ts 子入口导出，避免拖累主包）。
 */
export { toValueString as toString } from './toValueString'
export { escape } from './escape'
export { unescape } from './unescape'
export { camelCase } from './camelCase'
export { kebabCase } from './kebabCase'
export { template } from './template'
export type { TemplateOptions } from './template'
export { sortWithCharacter } from './sortWithCharacter'
export type { SortWithCharacterOption } from './sortWithCharacter'
export { format } from './format'
export { formatWithReq } from './formatWithReq'
export type { ReqRule } from './formatWithReq'
export { formatWithIndex } from './formatWithIndex'
export type { IndexRule } from './formatWithIndex'
export { checkPass } from './checkPass'
export { uuid } from './uuid'
export type { DescOrAsc } from './descOrAsc'
