/**
 * 环境检测（同构安全）
 *
 * 替代旧版 constant/static 在模块加载期固化 window/document/location 的做法：
 * 主包在任何环境（含 Node / SSR）中 import 都不产生副作用、不抛错。
 * 主包 tsconfig 无 DOM lib，因此通过 globalThis 的最小结构声明访问浏览器全局对象。
 */

interface BrowserGlobals {
  readonly window?: {
    readonly document?: unknown
    readonly location?: unknown
    readonly parent?: unknown
  }
  readonly document?: unknown
  readonly location?: unknown
}

const globals: BrowserGlobals = globalThis as BrowserGlobals & typeof globalThis

/** 是否运行在浏览器环境（以 window.document 存在为准） */
export const isBrowser: boolean =
  typeof globals.window !== 'undefined' && typeof globals.window.document !== 'undefined'

/** 惰性获取 window，非浏览器环境返回 undefined */
export function getWindow(): BrowserGlobals['window'] | undefined {
  return isBrowser ? globals.window : undefined
}

/**
 * 惰性获取 document，非浏览器环境返回 undefined。
 * 主包无 DOM lib，document 只能以 unknown 形态持有；泛型参数供浏览器域调用点
 * 以 getDocument<Document>() 直接拿到目标类型，替代各处散落的 as 断言。
 */
export function getDocument<T = unknown>(): T | undefined {
  if (!isBrowser) return undefined
  return (globals.document ?? globals.window?.document) as T | undefined
}

/** 惰性获取 location，非浏览器环境返回 undefined */
export function getLocation(): BrowserGlobals['location'] | undefined {
  if (!isBrowser) return undefined
  return globals.location ?? globals.window?.location
}
