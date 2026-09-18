/**
 * browser/url —— URL 解析与查询串序列化（M5：自旧 src/browser/{parseUrl,serialize,
 * serializer,unserialize,objectToUrlParam,getNowPageParam,getBaseURL,locat}.js TS 重写）
 *
 * 重写说明：
 * - 所有 location 访问经 internal/env 惰性求值（旧版 staticLocation 在模块加载期固化），
 *   node 下 import 安全：locat/getBaseURL 返回空值，parseUrl 相对路径按无 location 处理。
 * - 行为忠实旧版，含已知怪癖：unserialize 按 split('=') 取第二段（'a=b=c' → { a: 'b' }）；
 *   serialize 顶层跳过 undefined、嵌套不跳过；%20 输出为 '+'。
 * - 旧 getNowPageParam 直接读 document.location，新版统一经 getLocation()。
 */
import { getLocation } from '../internal/env'
import { each } from '../internal/iterate'
import { isArray, isNull, isPlainObject, isString, isUndefined } from '../internal/type'

/** parseUrl 的解析结果 */
export interface ParsedUrl {
  /** 完整链接（协议相对/根相对路径已补全） */
  href: string
  /** 哈希（含 #，长度 <=1 时为空串） */
  hash: string
  /** 主机名 + 端口 */
  host: string
  /** 主机名 */
  hostname: string
  /** 协议（含冒号） */
  protocol: string
  /** 端口（不含冒号） */
  port: string
  /** 查询串（含 ?） */
  search: string
  /** 路径（含查询与哈希，去掉协议与主机后的部分） */
  path: string
  /** 纯路径（去掉查询与哈希） */
  pathname: string
  /** 协议 + 主机 */
  origin: string
  /** 哈希中的路径键（# 与 ? 之间） */
  hashKey: string
  /** 哈希中的查询参数 */
  hashQuery: Record<string, string>
  /** 查询参数 */
  searchQuery: Record<string, string>
}

/* ------------------------------------------------------------------ *
 * 正则（模块顶层预编译，模式与旧实现一致）
 * ------------------------------------------------------------------ */
const searchRE = /(\?.*)/
const stripHashRE = /#.*/
const protocolRE = /^([a-z0-9.+-]*:)\/\//
const hostRE = /^([a-z0-9.+-]*)(:\d+)?\/?/
const hashRE = /(#.*)/
const hashKeyRE = /#((.*)\?|(.*))/
const stripQueryHashRE = /(\?|#.*).*/
const hashSlashRE = /#\//g
const spacePlusRE = /%20/g

/** 当前 location 的 origin（旧 helperGetLocatOrigin；无 location 返回空串） */
function locatOrigin(): string {
  const location = getLocation() as Location | undefined
  return location ? location.origin || `${location.protocol}//${location.host}` : ''
}

/**
 * 反序列化查询参数（旧 src/browser/unserialize.js）
 * 怪癖忠实保留：按 '=' 切分后仅取第二段，'a=b=c' → { a: 'b' }。
 * @param str 查询串（不含 '?'）
 */
export function unserialize(str: unknown): Record<string, string> {
  const result: Record<string, string> = {}
  if (str && isString(str)) {
    for (const param of str.split('&')) {
      const items = param.split('=')
      result[decodeURIComponent(items[0] ?? '')] = decodeURIComponent(items[1] || '')
    }
  }
  return result
}

/** 嵌套值的括号序列化（旧 src/browser/serializer.js 的 stringifyParams） */
function stringifyParams(resultVal: unknown, resultKey: string): string[] {
  const result: string[] = []
  each(resultVal, (item: unknown, key: string | number) => {
    if (isPlainObject(item) || isArray(item)) {
      result.push(...stringifyParams(item, `${resultKey}[${key}]`))
    } else {
      result.push(
        `${encodeURIComponent(`${resultKey}[${key}]`)}=${encodeURIComponent(isNull(item) ? '' : (item as string))}`,
      )
    }
  })
  return result
}

/**
 * 序列化查询参数（旧 src/browser/serializer.js 的 serialize）
 * 顶层跳过 undefined；数组与对象以 key[i] / key[k] 括号展开；%20 输出为 '+'。
 * @param query 查询参数对象
 */
export function serialize(query: unknown): string {
  const params: string[] = []
  each(query, (item: unknown, key: string | number) => {
    if (!isUndefined(item)) {
      if (isPlainObject(item) || isArray(item)) {
        params.push(...stringifyParams(item, String(key)))
      } else {
        params.push(
          `${encodeURIComponent(String(key))}=${encodeURIComponent(isNull(item) ? '' : (item as string))}`,
        )
      }
    }
  })
  return params.join('&').replace(spacePlusRE, '+')
}

/** serialize 的别名（旧 src/browser/objectToUrlParam.js） */
export const objectToUrlParam = serialize

/** 哈希/查询串取参：截取首个 '?' 之后的部分反序列化（旧 parseURLQuery） */
function parseURLQuery(uri: string): Record<string, string> {
  return unserialize(uri.split('?')[1] || '')
}

/**
 * 解析 URL（旧 src/browser/parseUrl.js）
 * 协议相对（//开头）补当前协议，根相对（/开头）补当前 origin。
 * @param url 需要解析的 URL
 */
export function parseUrl(url: string): ParsedUrl {
  const location = getLocation() as Location | undefined
  let href = `${url}`
  if (href.indexOf('//') === 0) {
    href = (location ? location.protocol : '') + href
  } else if (href.indexOf('/') === 0) {
    href = locatOrigin() + href
  }
  const searchMatch = href.replace(stripHashRE, '').match(searchRE)
  const parsed: ParsedUrl = {
    href,
    hash: '',
    host: '',
    hostname: '',
    protocol: '',
    port: '',
    search: searchMatch && searchMatch[1] && searchMatch[1].length > 1 ? searchMatch[1] : '',
    path: '',
    pathname: '',
    origin: '',
    hashKey: '',
    hashQuery: {},
    searchQuery: {},
  }
  parsed.path = href
    .replace(protocolRE, (_text: string, protocol: string): string => {
      parsed.protocol = protocol
      return ''
    })
    .replace(hostRE, (_text: string, hostname: string, port: string | undefined): string => {
      const portText = port || ''
      parsed.port = portText.replace(':', '')
      parsed.hostname = hostname
      parsed.host = hostname + portText
      return '/'
    })
    .replace(hashRE, (_text: string, hash: string): string => {
      parsed.hash = hash.length > 1 ? hash : ''
      return ''
    })
  const hashs = parsed.hash.match(hashKeyRE)
  parsed.pathname = parsed.path.replace(stripQueryHashRE, '')
  parsed.origin = `${parsed.protocol}//${parsed.host}`
  parsed.hashKey = hashs ? hashs[2] || hashs[1] || '' : ''
  parsed.hashQuery = parseURLQuery(parsed.hash)
  parsed.searchQuery = parseURLQuery(parsed.search)
  return parsed
}

/**
 * 获取当前地址栏信息（旧 src/browser/locat.js）
 * 无 location（非浏览器）时返回空对象（忠实旧版）。
 */
export function locat(): ParsedUrl {
  const location = getLocation() as Location | undefined
  return location ? parseUrl(location.href) : ({} as ParsedUrl)
}

/**
 * 获取当前页面（或指定串）的全部查询参数（旧 src/browser/getNowPageParam.js）
 * 按 '?' 分段逐段合并，段内 '#/' 移除。
 * @param s 指定串，缺省取当前地址
 */
export function getNowPageParam(s?: string): Record<string, string> {
  const location = getLocation() as Location | undefined
  const parts = (s ? s : location?.href ?? '').split('?')
  parts.shift()
  let param: Record<string, string> = {}
  for (const item of parts) {
    if (item) {
      param = { ...param, ...unserialize(item.replace(hashSlashRE, '')) }
    }
  }
  return param
}

/**
 * 获取当前站点的基础路径（旧 src/browser/getBaseURL.js）
 * 返回 origin + 到最后一个 '/' 为止的路径；无 location 返回空串。
 */
export function getBaseURL(): string {
  const location = getLocation() as Location | undefined
  if (location) {
    const pathname = location.pathname
    const lastIndex = pathname.lastIndexOf('/') + 1
    return locatOrigin() + (lastIndex === pathname.length ? pathname : pathname.substring(0, lastIndex))
  }
  return ''
}
