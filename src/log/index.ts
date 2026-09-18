/**
 * log 模块出口（2.0 严格 TS 版）
 *
 * 旧 8 文件（info/success/warning/error 仅颜色不同的 4 个复制粘贴文件 + table + image +
 * utils + index）合并为本域 6 文件；旧方法名全部保留为具名导出
 * （以旧 index.js 聚合为准：info/error/warning/warn/success/table/image）。
 *
 * isShowLog 同构语义（node 默认关闭、浏览器默认开启、setup 显式覆盖、
 * window.parent 向上遍历删除）见 ./isShowLog.ts 文件头。
 *
 * 注意：./table.ts / ./image.ts 的显式 .ts 后缀是旧 .js 未删（并存期 Vite 解析
 * 优先命中 .js）的临时方案，集成删除旧 .js 后应还原为无后缀。
 */
import { createStyledLogger } from './createStyledLogger'
import type { StyledLogger } from './createStyledLogger'

export { createStyledLogger } from './createStyledLogger'
export type { StyledLogger, LoggerStyle } from './createStyledLogger'
export { table } from './table'
export { image } from './image'

/** 信息打印（旧 log/info.js，主题色 #909399） */
export const info: StyledLogger = createStyledLogger({ title: 'Info', color: '#909399' })
/** 警告打印（旧 log/warning.js，主题色 #E6A23C） */
export const warning: StyledLogger = createStyledLogger({ title: 'Warning', color: '#E6A23C' })
/** 警告打印，warning 的别名（旧 index.js：warn: warning，同一引用） */
export const warn: StyledLogger = warning
/** 错误打印（旧 log/error.js，主题色 #F56C6C） */
export const error: StyledLogger = createStyledLogger({ title: 'Error', color: '#F56C6C' })
/** 成功打印（旧 log/success.js，主题色 #67C23A） */
export const success: StyledLogger = createStyledLogger({ title: 'Success', color: '#67C23A' })
