/**
 * browser/cookie —— cookie 读写（M5：合并旧两套实现为一）
 *
 * 合并说明：
 * - 以旧 src/browser/cookie.js（xe-utils 风格）为唯一实现基础：
 *   encodeURIComponent 编码、'30d'/'12h' 单位制过期、Date/时间戳/天数入参、
 *   静态方法族 has/set/setItem/get/getItem/remove/removeItem/keys/getJSON。
 * - 旧 src/cookie/{setCookie,getCookie,getToken}.js（escape/unescape + 正则全文匹配的
 *   独立实现）不再保留第二套编解码，改为基于同一实现的兼容别名：
 *   setCookie(name, value, seconds, path) 的 seconds 单位为秒；
 *   getCookie 未命中返回 null；getToken 默认键 XSRF-TOKEN（旧版子串包含匹配
 *   收紧为精确键名匹配）。
 * - bug 修复（2.0）：旧版读取 setupDefaults.cookies，但旧 setupDefaults 从未定义
 *   该字段（恒为 undefined），默认配置形同虚设；已在 internal/config 的
 *   setupDefaults 补齐 cookies 字段，写入时浅合并（项自身字段优先）。
 * - 忠实保留的旧怪癖：value 缺省写入字面量 "undefined"（encodeURIComponent 强转）；
 *   value 为 null/对象经 JSON.stringify；secure=false 会写入 "secure=false" 属性；
 *   非 document 环境一律返回 false。
 * - 与旧版的有意差异：expires 为 NaN（含 Invalid Date）时旧版在 `.replace` 上抛
 *   TypeError，新版静默按原值写入属性，不再抛错。
 */
import { getSetup } from '../internal/config'
import { getDocument } from '../internal/env'
import { isArray, isDate, isObject, isPlainObject, isString, isUndefined } from '../internal/type'

/** 一天的毫秒数（与 internal/datetime 的 staticDayTime 同值；本地化以隔离 M4 重写中的日期模块） */
const staticDayTime = 86400000

/** cookie 写入项（name 必填，其余可选） */
export interface CookieItem {
  /** 键名 */
  name: string
  /** 值；对象/null 自动 JSON 序列化，其余原样强转字符串 */
  value?: unknown
  /** 过期：天数（number）/ 毫秒时间戳 / Date / '30d' 单位串（y M d H h m s） */
  expires?: string | number | Date
  /** 路径 */
  path?: string
  /** 作用域 */
  domain?: string
  /** 仅 https 传输 */
  secure?: boolean
}

/** cookie 写入选项（写入项去掉 name/value 后的部分） */
export type CookieOptions = Omit<CookieItem, 'name' | 'value'>

/**
 * cookie 主函数：可调用（读/写）并携带静态方法族。
 * 调用形态（忠实旧版分派）：
 * - cookie() → 读取全部（Record）
 * - cookie('name') → 读取单个（string | undefined）
 * - cookie('name', value, options?) / cookie({...}) / cookie([{...}, ...]) → 写入，返回 true
 */
export interface CookieFn {
  /** 读取全部 cookie */
  (): Record<string, string>
  /** 读取单个（字符串入参）或写入（双参 / 单个配置对象 / 配置数组） */
  (
    name: string | number | CookieItem | readonly CookieItem[],
    value?: unknown,
    options?: CookieOptions,
  ): boolean | string | undefined
  /** 是否存在指定 cookie */
  has(key: string): boolean
  /** 写入（返回主函数自身，可链式） */
  set(name: string, value: unknown, options?: CookieOptions): CookieFn
  /** 同 set */
  setItem(name: string, value: unknown, options?: CookieOptions): CookieFn
  /** 读取单个 */
  get(name: string | number): string | undefined
  /** 读取单个 */
  getItem(name: string | number): string | undefined
  /** 删除（expires 置为一天前） */
  remove(name: string, options?: CookieOptions): void
  /** 同 remove */
  removeItem(name: string, options?: CookieOptions): void
  /** 全部键名 */
  keys(): string[]
  /** 读取全部 */
  getJSON(): Record<string, string>
}

/* ------------------------------------------------------------------ *
 * 正则（模块顶层预编译，移植自旧 src/browser/cookie.js）
 * ------------------------------------------------------------------ */

/** 单位制过期串：'30d' / '12h' / '2y' ... */
const cookieUnitRE = /^([0-9]+)(y|M|d|H|h|m|s)$/
/** 毫秒时间戳（11-13 位） */
const cookieTimestampRE = /^[0-9]{11,13}$/
/** 写入属性顺序（忠实旧版 arrayEach 顺序） */
const cookieAttrKeys = ['expires', 'path', 'domain', 'secure'] as const

/**
 * 相对当前时间按单位偏移后的毫秒时间戳（旧 toCookieUnitTime）。
 * y/M 的日期平移逻辑等价复刻自旧 src/date/getWhatYear.js / getWhatMonth.js：
 * 保持当日时分秒；跨月溢出（如 1.31 + 1M）回退为上一月最后一天。
 */
function toCookieUnitTime(unit: string, expires: string): number {
  const num = parseFloat(expires)
  const now = new Date()
  switch (unit) {
    case 'y': {
      const date = new Date(now.getTime())
      date.setFullYear(date.getFullYear() + num)
      return date.getTime()
    }
    case 'M': {
      const date = new Date(now.getTime())
      const day = date.getDate()
      date.setMonth(date.getMonth() + num)
      if (day !== date.getDate()) {
        // 指定天数被跨月：回退为上一月最后一天（旧 getWhatMonth 语义）
        date.setDate(1)
        return date.getTime() - staticDayTime
      }
      return date.getTime()
    }
    case 'd':
      return now.getTime() + num * staticDayTime
    case 'h':
    case 'H':
      return now.getTime() + num * 60 * 60 * 1000
    case 'm':
      return now.getTime() + num * 60 * 1000
    case 's':
      return now.getTime() + num * 1000
    default:
      return now.getTime()
  }
}

/** 过期值转 UTC 串（旧 toCookieUTCString：Date 直取，其余经 new Date 强转） */
function toCookieUTCString(date: string | number | Date): string {
  return (isDate(date) ? date : new Date(date)).toUTCString()
}

/** 写入一批 cookie（调用方保证 document 存在） */
function writeCookies(inserts: readonly CookieItem[]): void {
  const doc = getDocument() as Document | undefined
  if (!doc) {
    return
  }
  for (const raw of inserts) {
    const opts: CookieItem = { ...getSetup().cookies, ...raw }
    if (!opts.name) {
      continue
    }
    const values: string[] = []
    // 旧版 encodeURIComponent(isObject(value) ? JSON.stringify(value) : value)：
    // undefined 强转为 "undefined"、null 因 isObject(null)===true 走 JSON.stringify
    values.push(
      `${encodeURIComponent(opts.name)}=${encodeURIComponent(
        isObject(opts.value) ? JSON.stringify(opts.value) : (opts.value as string),
      )}`,
    )
    let expires = opts.expires
    if (expires) {
      // +expires 一元加还原旧版全局 isNaN 的强转语义（本仓移植规约 Number.isNaN(+x)）：
      // '1h' 等单位串须在此判 NaN 走单位换算，漏加强转会错落进下方「数字按天数」分支
      if (Number.isNaN(+expires)) {
        // 单位串（'30d' 等）转 UTC；非单位串（如 '-1h' 不匹配单位正则）原样写入
        // （与旧版 replace 不匹配时一致，但旧版对非字符串入参会在此抛 TypeError，
        // 新版不再抛错——见文件头说明）
        const unitMatch = typeof expires === 'string' ? expires.match(cookieUnitRE) : null
        if (unitMatch) {
          expires = toCookieUTCString(toCookieUnitTime(unitMatch[2] as string, unitMatch[1] as string))
        }
      } else if (cookieTimestampRE.test(String(expires)) || isDate(expires)) {
        // 时间戳 / Date
        expires = toCookieUTCString(expires)
      } else {
        // 数字按天数
        expires = toCookieUTCString(toCookieUnitTime('d', String(expires)))
      }
      opts.expires = expires
    }
    for (const key of cookieAttrKeys) {
      const attrValue = opts[key]
      if (!isUndefined(attrValue)) {
        // 忠实旧版：secure 仅在真值时输出裸属性，false 会写成 "secure=false"
        values.push(attrValue && key === 'secure' ? key : `${key}=${attrValue as string}`)
      }
    }
    doc.cookie = values.join('; ')
  }
}

/** 读取全部 cookie 为对象（调用方保证 document 存在；无 cookie 返回空对象） */
function readCookies(): Record<string, string> {
  const doc = getDocument() as Document | undefined
  const result: Record<string, string> = {}
  if (doc && doc.cookie) {
    for (const val of doc.cookie.split('; ')) {
      const keyIndex = val.indexOf('=')
      result[decodeURIComponent(val.substring(0, keyIndex))] = decodeURIComponent(
        val.substring(keyIndex + 1) || '',
      )
    }
  }
  return result
}

/** 旧 cookie 主逻辑（多参形态分派忠实旧版：数组 > 双参 > 单对象 > 读取） */
function cookieBase(...args: unknown[]): boolean | string | Record<string, string> | undefined {
  if (!getDocument()) {
    // 忠实旧版：无 document 环境读写一律返回 false
    return false
  }
  const name = args[0]
  let inserts: CookieItem[]
  if (isArray<CookieItem>(name)) {
    inserts = name
  } else if (args.length > 1) {
    inserts = [{ name: name as string, value: args[1], ...(args[2] as CookieOptions | undefined) }]
  } else if (isObject(name)) {
    inserts = [name as CookieItem]
  } else {
    inserts = []
  }
  if (inserts.length > 0) {
    writeCookies(inserts)
    return true
  }
  const result = readCookies()
  return args.length === 1 ? result[name as string] : result
}

/* ------------------------------------------------------------------ *
 * 静态方法族（旧 src/browser/cookie.js 的 assign(cookie, {...})）
 * ------------------------------------------------------------------ */

function hasCookieItem(key: string): boolean {
  return cookieKeys().includes(key)
}

function getCookieItem(name: string | number): string | undefined {
  const value = cookieBase(name)
  return isString(value) ? value : undefined
}

function setCookieItem(name: string, value: unknown, options?: CookieOptions): CookieFn {
  cookieBase(name, value, options)
  return cookie
}

function removeCookieItem(name: string, options?: CookieOptions): void {
  // 合并顺序忠实旧版 assign({ expires: -1 }, setupDefaults.cookies, options)
  cookieBase(name, 0, { expires: -1, ...getSetup().cookies, ...options })
}

function cookieKeys(): string[] {
  return Object.keys(cookieBase() as Record<string, string>)
}

/** cookie 主函数（携带静态方法族） */
export const cookie: CookieFn = Object.assign(cookieBase as CookieFn, {
  has: hasCookieItem,
  set: setCookieItem,
  setItem: setCookieItem,
  get: getCookieItem,
  getItem: getCookieItem,
  remove: removeCookieItem,
  removeItem: removeCookieItem,
  keys: cookieKeys,
  getJSON: () => cookieBase() as Record<string, string>,
})

/* ------------------------------------------------------------------ *
 * 兼容别名（合并自旧 src/cookie/*.js，统一走上面的唯一实现）
 * ------------------------------------------------------------------ */

/**
 * 设置 cookie（旧 src/cookie/setCookie.js 的兼容签名）
 * @param name 键名
 * @param value 值
 * @param seconds 生存期（秒），0 表示会话 cookie
 * @param path 路径
 */
export function setCookie(name: string, value: string, seconds = 0, path?: string): boolean {
  const options: CookieOptions = {}
  if (seconds !== 0) {
    options.expires = new Date(Date.now() + seconds * 1000)
  }
  if (path !== undefined) {
    options.path = path
  }
  return cookieBase(name, value, options) === true
}

/**
 * 获取 cookie（旧 src/cookie/getCookie.js 的兼容签名；未命中返回 null）
 * @param name 键名
 */
export function getCookie(name: string): string | null {
  const value = cookieBase(name)
  return isString(value) ? value : null
}

/**
 * 获取 token（旧 src/cookie/getToken.js；默认键 XSRF-TOKEN，未命中返回空串）
 * @param name 键名，默认 XSRF-TOKEN
 */
export function getToken(name = 'XSRF-TOKEN'): string {
  const all = cookieBase()
  if (isPlainObject(all)) {
    return (all[name] as string | undefined) ?? ''
  }
  return ''
}
