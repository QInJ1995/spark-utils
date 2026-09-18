/**
 * browser/ua —— 浏览器/系统/设备识别（M5：TS 重写，惰性函数化）
 *
 * 重写说明：
 * - 旧版 clientBrowser/clientSystem/clientScreenSize 是模块加载期求值的
 *   `export const { ... } = getBrowserInfo()`（import 即触碰 navigator/screen，
 *   且固化首次结果）；新版全部改为惰性函数：调用时才经 internal/env 读取
 *   navigator/screen，node 下 import 零副作用、不抛错。
 * - 删除 IE 系方法与 IE 分支（2.0 破坏点）：isIE/isIE9/isIE10/isIE11/
 *   IEVersion/notSupported 整体移除；getBrowserInfo 不再识别 msie/Trident；
 *   getStyle 不再走 currentStyle（见 dom.ts）。browse() 输出中的 msie 字段
 *   （源于 '-ms' 前缀探测，现代浏览器恒 false）保留以维持返回形状兼容。
 * - 旧版依赖 RegExp.$1/$2 遗留属性的写法改为 match 捕获组；正则全部顶层预编译。
 */
import { getDocument, getWindow } from '../internal/env'

/** browse() 的返回结构（键序与旧版输出一致） */
export interface BrowseInfo {
  /** 是否 Node 环境 */
  isNode: boolean
  /** 是否移动端 */
  isMobile: boolean
  /** 是否 PC 端 */
  isPC: boolean
  /** 是否有 document（DOM 环境） */
  isDoc: boolean
  /** 前缀 matchesSelector 探测（'-webkit' 等，仅 isDoc 时存在） */
  '-webkit'?: boolean
  '-khtml'?: boolean
  '-moz'?: boolean
  '-ms'?: boolean
  '-o'?: boolean
  /** 是否 Edge */
  edge?: boolean
  /** 是否 Firefox */
  firefox?: boolean
  /** 是否 IE（'-ms' 前缀探测；现代浏览器恒 false，仅为保持旧输出形状保留） */
  msie?: boolean
  /** 是否 Safari */
  safari?: boolean
  /** localStorage 是否可用 */
  isLocalStorage?: boolean
  /** sessionStorage 是否可用 */
  isSessionStorage?: boolean
}

/** getBrowserInfo() 的返回结构（旧字段 Browser/versionNum 的 2.0 命名） */
export interface BrowserInfo {
  /** 浏览器名：firefox / edge / chrome / safari / opera / UNKNOWN */
  browser: string
  /** 主版本号（数字串，无法识别时为空串） */
  version: string
}

/* ------------------------------------------------------------------ *
 * 正则与常量（模块顶层预编译）
 * ------------------------------------------------------------------ */
const mobileRE = /(Android|webOS|iPhone|iPad|iPod|SymbianOS|BlackBerry|Windows Phone)/
const vendorPrefixes = ['webkit', 'khtml', 'moz', 'ms', 'o'] as const
const firefoxRE = /firefox\/(\d+)/
const edgeRE = /edge\/(\d+)/
const chromeRE = /chrome\/(\d+)/
const safariRE = /version\/(\d+)/
const operaRE = /(?:opera|opr)\/(\d+)/
const winVersionRE = /Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/
const winPhoneRE = /Windows Phone OS (\d+.\d)/i
const iosVersionRE = /CPU (?:iPhone )?OS (\d+_\d+)/i
const androidRE = /Android (\d+\.\d+)/i
const playstationRE = /PlayStation/i
/** Windows NT 版本号 → 名称（旧 switch 映射） */
const winVersionMap: Readonly<Record<string, string>> = {
  '5.0': '2000',
  '5.1': 'XP',
  '6.0': 'Vista',
  '6.1': '7',
  '6.2': '8',
  '6.3': '10',
  '10.0': '10',
}

/** 当前 userAgent（经 env 惰性读取；非浏览器返回空串） */
function userAgent(): string {
  return (getWindow() as Window | undefined)?.navigator.userAgent ?? ''
}

/** 存储可用性探测（旧 isBrowseStorage：试写试删一个探针键） */
function isBrowseStorage(storage: Storage | undefined): boolean {
  if (!storage) {
    return false
  }
  try {
    storage.setItem('__xe_t', '1')
    storage.removeItem('__xe_t')
    return true
  } catch {
    return false
  }
}

/**
 * 获取浏览器内核与能力信息（旧 src/browser/browse.js）
 * 非浏览器环境返回 { isNode / isDoc } 基础标记。
 */
export function browse(): BrowseInfo {
  const win = getWindow() as Window | undefined
  const doc = getDocument() as Document | undefined
  const result: BrowseInfo = { isNode: false, isMobile: false, isPC: false, isDoc: !!doc }
  if (!win) {
    if (typeof process !== 'undefined') {
      result.isNode = true
    }
    return result
  }
  const ua = win.navigator.userAgent
  const isEdge = ua.indexOf('Edge') > -1
  const isChrome = ua.indexOf('Chrome') > -1
  const isMobile = mobileRE.test(ua)
  if (result.isDoc && doc) {
    const body = (doc.body ?? doc.documentElement) as Element | null
    const prefixed = result as unknown as Record<string, unknown>
    for (const core of vendorPrefixes) {
      prefixed[`-${core}`] = !!(body && (body as unknown as Record<string, unknown>)[`${core}MatchesSelector`])
    }
  }
  result.edge = isEdge
  result.firefox = ua.indexOf('Firefox') > -1
  result.msie = !isEdge && !!result['-ms']
  result.safari = !isChrome && !isEdge && ua.indexOf('Safari') > -1
  result.isMobile = isMobile
  result.isPC = !isMobile
  result.isLocalStorage = isBrowseStorage(win.localStorage)
  result.isSessionStorage = isBrowseStorage(win.sessionStorage)
  return result
}

/**
 * 获取浏览器名与版本（旧 src/browser/getBrowserInfo.js；IE 分支已删除）
 */
export function getBrowserInfo(): BrowserInfo {
  const agent = userAgent().toLowerCase()
  const firefoxMatch = agent.match(firefoxRE)
  if (firefoxMatch) {
    return { browser: 'firefox', version: firefoxMatch[1] ?? '' }
  }
  const edgeMatch = agent.match(edgeRE)
  if (edgeMatch) {
    return { browser: 'edge', version: edgeMatch[1] ?? '' }
  }
  const chromeMatch = agent.match(chromeRE)
  if (chromeMatch) {
    return { browser: 'chrome', version: chromeMatch[1] ?? '' }
  }
  if (agent.indexOf('safari') > -1 && agent.indexOf('chrome') < 0) {
    return { browser: 'safari', version: agent.match(safariRE)?.[1] ?? '' }
  }
  const operaMatch = agent.match(operaRE)
  if (agent.indexOf('opera') > -1 && operaMatch) {
    return { browser: 'opera', version: operaMatch[1] ?? '' }
  }
  return { browser: 'UNKNOWN', version: '' }
}

/**
 * 当前浏览器名（旧 clientBrowser：加载期求值改为惰性函数）
 * @returns firefox / edge / chrome / safari / opera / UNKNOWN
 */
export function clientBrowser(): string {
  return getBrowserInfo().browser
}

/**
 * 当前操作系统名（旧 getCurrentSystemInfo 的 System：加载期求值改为惰性函数）
 * 按旧版探测顺序取第一个命中的键：win / mac / xll / iphone / ipod / ipad /
 * ios / android / nokiaN / winMobile / wii / ps，未命中返回 UNKNOWN。
 */
export function clientSystem(): string {
  const win = getWindow() as Window | undefined
  if (!win) {
    return 'UNKNOWN'
  }
  const ua = win.navigator.userAgent
  const platform = win.navigator.platform
  const system: Record<string, boolean | number | string | undefined> = {
    win: undefined,
    mac: undefined,
    xll: undefined,
    iphone: undefined,
    ipod: undefined,
    ipad: undefined,
    ios: undefined,
    android: undefined,
    nokiaN: undefined,
    winMobile: undefined,
    wii: undefined,
    ps: undefined,
  }
  // 平台探测
  system.win = platform.indexOf('Win') === 0
  system.mac = platform.indexOf('Mac') === 0
  system.xll = platform.indexOf('Xll') === 0 || platform.indexOf('Linux') === 0
  // Windows 版本
  if (system.win) {
    const winMatch = ua.match(winVersionRE)
    if (winMatch) {
      const tag = winMatch[1] ?? ''
      if (tag === 'NT') {
        system.win = winVersionMap[winMatch[2] ?? ''] ?? 'NT'
      } else if (tag === '9x') {
        system.win = 'ME'
      } else {
        system.win = tag
      }
    }
  }
  // 移动设备
  system.iphone = ua.indexOf('iPhone') > -1
  system.ipod = ua.indexOf('iPod') > -1
  system.ipad = ua.indexOf('iPad') > -1
  system.nokiaN = ua.indexOf('nokiaN') > -1
  // Windows Mobile
  if (system.win === 'CE') {
    system.winMobile = system.win
  } else if (system.win === 'Ph') {
    const phoneMatch = ua.match(winPhoneRE)
    if (phoneMatch) {
      system.win = 'Phone'
      system.winMobile = parseFloat(phoneMatch[1] ?? '0')
    }
  }
  // iOS 版本
  if (system.mac && ua.indexOf('Mobile') > -1) {
    const iosMatch = ua.match(iosVersionRE)
    system.ios = iosMatch ? parseFloat((iosMatch[1] ?? '').replace('_', '.')) : 2
  }
  // Android 版本
  const androidMatch = ua.match(androidRE)
  if (androidMatch) {
    system.android = parseFloat(androidMatch[1] ?? '0')
  }
  // 游戏系统
  system.wii = ua.indexOf('Wii') > -1
  system.ps = playstationRE.test(ua)
  const first = Object.entries(system).find(([, value]) => value)
  return first?.[0] ?? 'UNKNOWN'
}

/**
 * 当前屏幕尺寸（旧 clientScreenSize：加载期求值改为惰性函数）
 * @returns '宽,高'（如 '1920,1080'；非浏览器返回空串）
 */
export function clientScreenSize(): string {
  const win = getWindow() as Window | undefined
  if (!win) {
    return ''
  }
  return `${win.screen.width},${win.screen.height}`
}

/** 是否 Chrome（旧 src/browser/isChrome.js；调用时读取 userAgent） */
export function isChrome(): boolean {
  const ua = userAgent()
  return ua.indexOf('Chrome') > -1 && ua.indexOf('Safari') > -1
}

/** 是否 Firefox（旧 src/browser/isFireFox.js） */
export function isFireFox(): boolean {
  return userAgent().indexOf('Firefox') > -1
}

/** 是否 Safari（Chrome 分支排除；旧 src/browser/isSafari.js） */
export function isSafari(): boolean {
  const ua = userAgent()
  return ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1
}
