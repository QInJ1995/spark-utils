/**
 * browser/crossDomain —— 跨文档（iframe/postMessage）通讯（M5 安全重设计）
 *
 * 安全变更（相对旧 src/browser/crossDomain.js，全部为 2.0 破坏点）：
 * 1. 移除 import 期副作用：旧版在模块加载时即向 window 挂载
 *    receiveMessage/sendMessage 全局并注册 message 监听（require 即激活）；
 *    新版仅在显式调用 setupCrossDomain(options) 后才建立监听，
 *    未注册时本模块在任何环境 import 均零副作用。
 * 2. 移除 eval()：旧版以 eval(obj.callFun) 执行消息中携带的任意函数名字符串，
 *    等于向任何能向本页 postMessage 的来源开放任意代码执行；
 *    新版改为 allowCalls 白名单注册表，仅执行显式注册过的函数，
 *    未注册的调用名一律丢弃。
 * 3. 增加来源校验：收到消息时校验 event.origin 必须命中 allowOrigins
 *    白名单（精确匹配，不支持通配符），未注册来源直接丢弃。
 * 4. postMessage 目标 origin 显式化：setupCrossDomain 的 targetOrigin
 *    （默认仍为 '*' 仅作保底，强烈建议显式指定）；回执消息固定回发到
 *    已通过校验的对端 origin，不再使用 '*'。
 * 5. 不再向 window 挂载 receiveMessage/sendMessage 全局变量；
 *    通讯双方协议字段（crossDomain/call/callFun/arg/callBackFun）保持不变，
 *    但回调名同样必须在对端 allowCalls 中注册。
 */
import { getDocument, getWindow } from '../internal/env'

/** 可被跨域调用的本地函数（入参为消息 arg，返回值作为回执） */
export type CrossDomainCallFn = (arg: unknown) => unknown

/** setupCrossDomain 选项 */
export interface CrossDomainOptions {
  /** 允许接收消息的来源 origin 白名单（精确匹配，如 'https://a.com'） */
  allowOrigins: readonly string[]
  /** 允许被跨域调用的方法注册表（方法名 -> 本地实现；未注册的调用名被丢弃） */
  allowCalls: Readonly<Record<string, CrossDomainCallFn>>
  /** 发送消息的 postMessage targetOrigin；默认 '*'（保底，建议显式指定） */
  targetOrigin?: string
}

/** 发送目标：iframe 的 id / window 对象 / null（默认顶层窗口） */
export type CrossDomainTarget = string | Window | null

/** setupCrossDomain 返回的句柄 */
export interface CrossDomainHandle {
  /** 发送跨域调用（语义同模块级 sendMessage） */
  sendMessage(target: CrossDomainTarget, callName: string, arg?: unknown, callBackName?: string): void
  /** 注销监听与白名单（幂等） */
  destroy(): void
}

/** 消息协议（字段名与旧版一致） */
interface CrossDomainMessage {
  crossDomain: boolean
  call: boolean
  callFun: string
  arg?: unknown
  callBackFun?: string
}

/** 当前注册（未 setup 时为 undefined，收到消息直接忽略） */
let activeOptions: CrossDomainOptions | undefined
let activeListener: ((event: MessageEvent) => void) | undefined

/** 校验并处理一条入站消息（模块内部；来源与调用名双白名单） */
function receiveMessage(event: MessageEvent): void {
  const options = activeOptions
  if (!options) {
    return
  }
  // 来源白名单：精确匹配，未注册来源直接丢弃
  if (!options.allowOrigins.includes(event.origin)) {
    return
  }
  const data: unknown = event.data
  if (!data || typeof data !== 'object') {
    return
  }
  const message = data as Record<string, unknown>
  if (message.crossDomain !== true || message.call !== true) {
    return
  }
  const callFun = message.callFun
  if (typeof callFun !== 'string') {
    return
  }
  // 调用名白名单：仅执行显式注册过的函数（替代旧版 eval）
  const callFn = options.allowCalls[callFun]
  if (typeof callFn !== 'function') {
    return
  }
  let result: unknown
  try {
    result = callFn(message.arg)
  } catch {
    // 调用异常不外泄（旧版 try/catch 吞错风格）；协议无错误通道
    return
  }
  const callBackFun = message.callBackFun
  if (typeof callBackFun === 'string' && event.source) {
    // 回执固定回发到已通过校验的对端 origin（跨文档场景 source 即对端 Window）
    postTo(
      event.source as Window,
      { crossDomain: true, call: true, callFun: callBackFun, arg: result },
      event.origin,
    )
  }
}

/** 向目标窗口投递消息（目标不可达时静默，忠实旧版吞错风格） */
function postTo(source: Window | null | undefined, message: CrossDomainMessage, targetOrigin: string): void {
  try {
    source?.postMessage(message, targetOrigin)
  } catch {
    // 忽略不可达目标
  }
}

/** 注销当前监听（幂等） */
function destroyActive(): void {
  const win = getWindow() as Window | undefined
  if (activeListener && win) {
    win.removeEventListener('message', activeListener)
  }
  activeListener = undefined
  activeOptions = undefined
}

/**
 * 注册跨域通讯：建立 message 监听，登记来源白名单与可调用函数表
 * @param options 白名单配置
 * @returns 句柄；非浏览器环境返回 false
 */
export function setupCrossDomain(options: CrossDomainOptions): CrossDomainHandle | false {
  const win = getWindow() as Window | undefined
  if (!win) {
    return false
  }
  // 幂等：重复 setup 先注销旧监听
  destroyActive()
  activeOptions = options
  const listener = (event: MessageEvent): void => {
    receiveMessage(event)
  }
  activeListener = listener
  win.addEventListener('message', listener)
  return {
    sendMessage: (target, callName, arg, callBackName) => {
      sendMessage(target, callName, arg, callBackName)
    },
    destroy: destroyActive,
  }
}

/**
 * 发送跨域调用（旧 window.sendMessage 的模块级版本）
 * @param target iframe 的 id / 目标 window（如 window.parent）/ null（默认顶层）
 * @param callFun 目标页面 allowCalls 中注册的方法名
 * @param arg 参数
 * @param callBackFun 回执方法名（需在目标页面 allowCalls 中注册）
 */
export function sendMessage(
  target: CrossDomainTarget,
  callFun: string,
  arg?: unknown,
  callBackFun?: string,
): void {
  const win = getWindow() as Window | undefined
  if (!win) {
    return
  }
  let source: Window | null | undefined
  if (typeof target === 'string') {
    const doc = getDocument() as Document | undefined
    const frames = win.top?.frames as unknown as Record<string, Window | undefined> | undefined
    const frame =
      (doc?.getElementById(target) as HTMLIFrameElement | null)?.contentWindow ?? frames?.[target]
    if (!frame) {
      return
    }
    source = frame
  } else if (target !== null && typeof target === 'object') {
    source = target
  } else {
    source = win.top
  }
  const message: CrossDomainMessage = {
    crossDomain: true,
    call: true,
    callFun,
    arg: arg || '',
    ...(callBackFun ? { callBackFun } : {}),
  }
  postTo(source, message, activeOptions?.targetOrigin ?? '*')
}
