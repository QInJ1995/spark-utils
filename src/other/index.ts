/**
 * other 模块出口（2.0 严格 TS 版）
 *
 * 删除项：onMountDialog（Vue2 专属——动态 import vue + Vue.extend/$mount/$on 的命令式
 * 弹窗挂载，2.0 不再随库分发）。
 *
 * 三个证件校验（validate2ndIdCard/hkIdVerify/macauIdCard）出参统一为 IDCardResult
 * 判别对象（有意 API 变更，需登记 test/overrides.json，详见 ./idCardResult.ts 文件头）。
 *
 * 注意：各导入的显式 .ts 后缀是旧 .js 未删（并存期 Vite 解析优先命中 .js）的临时方案，
 * 集成删除旧 .js 后应还原为无后缀。
 */
export { StateFlow } from './stateFlow'
export { promiseResultHandle } from './promiseResultHandle'
export type { PromiseResultHandleOptions } from './promiseResultHandle'
export { validate2ndIdCard } from './validate2ndIdCard'
export { hkIdVerify } from './hkIdVerify'
export { macauIdCard } from './macauIdCard'
export type { IDCardResult } from './idCardResult'
