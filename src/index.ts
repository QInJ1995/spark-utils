/**
 * spark-utils 主入口（同构：Node 与浏览器通用）
 *
 * - 浏览器专属方法：`import { ... } from 'spark-utils/browser'`
 * - 加密方法：`import { ... } from 'spark-utils/crypto'`
 */

export const VERSION = '2.0.0-beta.0'

export * from './basic/index'
export * from './array/index'
export * from './number/index'
export * from './string/index'
export * from './object/index'
