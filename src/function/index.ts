/**
 * function 模块出口——仅具名导出（2.0 起不再提供 default 聚合对象）
 *
 * 旧版 bind 已在 2.0 删除（ES2015+ 原生 Function.prototype.bind / 箭头函数覆盖），
 * 不再移植；其余方法语义见各自文件头注释。
 */
export { noop } from './noop'
export { delay } from './delay'
export { once } from './once'
export { after } from './after'
export { before } from './before'
export { throttle, type ThrottleOptions } from './throttle'
export { debounce, type DebounceOptions, type CancelableFunction } from './debounce'
export { loop } from './loop'
