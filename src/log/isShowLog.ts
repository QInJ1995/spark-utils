/**
 * 日志开关判定（移植自旧 src/log/utils.js 的 isShowLog，2.0 同构化）
 *
 * isShowLog 同构语义（2.0，有意变更）：
 * 1. setup({ showLog: true/false }) 显式设置时以 setup 为准——node 环境亦经此开启；
 *    （「是否显式设置」以 getSetup() 与默认配置的引用差异判定：setup() 一经调用即视为显式，
 *    故 node 下 setup 其他字段而不希望开日志时，需显式 setup({ showLog: false })）
 * 2. 未配置时按环境默认：浏览器开启，node 关闭
 *    （旧版默认恒开启——旧 isShowLog 在 showLog 为真时直接返回 true，node 下也会打印；
 *    2.0 收敛服务端静默，属有意行为变更）；
 * 3. 旧版 showLog 关闭时向上遍历 window.parent 寻找 showLog 的 iframe 逃生通道已删除
 *    （旧实现依赖 window 全局，node 下访问即抛错；iframe 场景请宿主自行 setup）。
 */
import { getSetup, setupDefaults } from '../internal/config'
import { isBrowser } from '../internal/env'

/** 当前是否允许输出日志 */
export function isShowLog(): boolean {
  const current = getSetup()
  if (current !== setupDefaults) {
    // setup() 已被调用：显式配置优先
    return current.showLog
  }
  // 未配置：浏览器默认开启，node 默认关闭
  return isBrowser
}
