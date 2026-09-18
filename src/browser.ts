/**
 * spark-utils/browser 子入口：浏览器专属方法（M5）
 *
 * 分组：cookie / storage / dom / ua / url / crossDomain / clipboard。
 * 全部 window/document/location/navigator/screen 访问经 internal/env 惰性求值，
 * node 下 import 本入口零副作用、零全局触碰、不抛错
 * （crossDomain 的监听仅在显式 setupCrossDomain() 后建立）。
 *
 * 2.0 删除项（相对旧 src/browser/index.js 的导出面）：
 * - IE 系：isIE / isIE9 / isIE10 / isIE11 / IEVersion / notSupported；
 * - 旧 src/cookie 的独立实现（setCookie/getCookie/getToken 并入 cookie 兼容别名）；
 * - 旧 crossDomain 的 window.receiveMessage / window.sendMessage 全局挂载与 eval 执行。
 */
export { cookie, setCookie, getCookie, getToken } from './browser/cookie'
export type { CookieFn, CookieItem, CookieOptions } from './browser/cookie'

export { createWebStorage, getStorage, webStorage } from './browser/storage'
export type { WebStorageCreator, WebStorageOptions } from './browser/storage'

export { getStyle, getWidth, getHeight } from './browser/dom'

export {
  browse,
  getBrowserInfo,
  clientBrowser,
  clientSystem,
  clientScreenSize,
  isChrome,
  isFireFox,
  isSafari,
} from './browser/ua'
export type { BrowseInfo, BrowserInfo } from './browser/ua'

export {
  parseUrl,
  serialize,
  unserialize,
  objectToUrlParam,
  getNowPageParam,
  getBaseURL,
  locat,
} from './browser/url'
export type { ParsedUrl } from './browser/url'

export { setupCrossDomain, sendMessage } from './browser/crossDomain'
export type {
  CrossDomainCallFn,
  CrossDomainHandle,
  CrossDomainOptions,
  CrossDomainTarget,
} from './browser/crossDomain'

export { copyText } from './browser/clipboard'
