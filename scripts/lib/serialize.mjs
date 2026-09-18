/**
 * fixtures 序列化协议（生成器与比较器共用）
 *
 * normalize: 任意 JS 值 → 可 JSON 序列化的规范化结构（带 __type 标签）
 * revive:    规范化结构 → 还原为可调用参数
 * deepClone: 参数深克隆（双调用确定性检测用；函数按引用）
 */

export function normalize(value, seen = new WeakSet()) {
  if (value === undefined) return { __type: 'undefined' }
  if (value === null) return null
  if (Number.isNaN(value)) return { __type: 'NaN' }
  if (value === Infinity) return { __type: 'Infinity' }
  if (value === -Infinity) return { __type: '-Infinity' }
  const t = typeof value
  if (t === 'number' || t === 'boolean' || t === 'string') return value
  if (t === 'bigint') return { __type: 'bigint', value: value.toString() }
  if (t === 'symbol') return { __type: 'Symbol', description: value.description ?? null }
  if (t === 'function') return { __type: 'Function', src: value.toString() }
  if (value instanceof Date) return { __type: 'Date', value: Number.isNaN(value.getTime()) ? 'invalid' : value.toISOString() }
  if (value instanceof RegExp) return { __type: 'RegExp', source: value.source, flags: value.flags }
  if (value instanceof Error) return { __type: 'Error', name: value.name, message: value.message }
  if (value instanceof WeakMap) return { __type: 'WeakMap' }
  if (value instanceof WeakSet) return { __type: 'WeakSet' }
  if (value instanceof Promise) return { __type: 'Promise' }
  if (typeof FormData !== 'undefined' && value instanceof FormData) {
    return { __type: 'FormData', value: [...value.entries()].map(([k, v]) => [k, normalize(v, seen)]) }
  }
  if (value instanceof Map) {
    return { __type: 'Map', value: [...value.entries()].map(([k, v]) => [normalize(k, seen), normalize(v, seen)]) }
  }
  if (value instanceof Set) {
    return { __type: 'Set', value: [...value.values()].map((v) => normalize(v, seen)) }
  }
  if (Array.isArray(value)) return value.map((v) => normalize(v, seen))
  if (t === 'object') {
    if (Object.prototype.toString.call(value) === '[object Arguments]') {
      return { __type: 'Arguments', value: [...value].map((v) => normalize(v, seen)) }
    }
    if (seen.has(value)) return { __type: 'Circular' }
    seen.add(value)
    const ctor = value.constructor?.name
    const out = { __type: 'Object' }
    if (ctor && ctor !== 'Object') out.ctor = ctor
    out.value = {}
    for (const k of Object.keys(value)) out.value[k] = normalize(value[k], seen)
    return out
  }
  return { __type: 'Unknown', value: String(value) }
}

export function revive(normalized) {
  if (normalized === null || typeof normalized !== 'object') return normalized
  if (Array.isArray(normalized)) return normalized.map(revive)
  const tag = normalized.__type
  switch (tag) {
    case undefined: {
      const out = {}
      for (const k of Object.keys(normalized)) out[k] = revive(normalized[k])
      return out
    }
    case 'undefined':
      return undefined
    case 'NaN':
      return Number.NaN
    case 'Infinity':
      return Number.POSITIVE_INFINITY
    case '-Infinity':
      return Number.NEGATIVE_INFINITY
    case 'bigint':
      return BigInt(normalized.value)
    case 'Symbol':
      return Symbol(normalized.description ?? undefined)
    case 'Date':
      return normalized.value === 'invalid' ? new Date(Number.NaN) : new Date(normalized.value)
    case 'RegExp':
      return new RegExp(normalized.source, normalized.flags)
    case 'Function':
      return new Function(`return (${normalized.src})`)()
    case 'Error': {
      const error = new Error(normalized.message)
      error.name = normalized.name
      return error
    }
    case 'WeakMap':
      return new WeakMap()
    case 'WeakSet':
      return new WeakSet()
    case 'Promise':
      return Promise.resolve(undefined)
    case 'FormData': {
      const form = new FormData()
      for (const [k, v] of normalized.value ?? []) form.append(k, revive(v))
      return form
    }
    case 'Arguments':
      return (function (..._args) {
        return arguments
      })(...(normalized.value ?? []).map(revive))
    case 'Map':
      return new Map(normalized.value.map(([k, v]) => [revive(k), revive(v)]))
    case 'Set':
      return new Set(normalized.value.map(revive))
    case 'Object': {
      const out = {}
      for (const k of Object.keys(normalized.value ?? {})) out[k] = revive(normalized.value[k])
      return out
    }
    default:
      return normalized
  }
}

export function deepClone(value) {
  if (Array.isArray(value)) return value.map(deepClone)
  if (value && typeof value === 'object') {
    if (value instanceof Date) return new Date(value.getTime())
    if (value instanceof RegExp) return new RegExp(value.source, value.flags)
    if (value instanceof Map) return new Map([...value.entries()].map(([k, v]) => [deepClone(k), deepClone(v)]))
    if (value instanceof Set) return new Set([...value.values()].map(deepClone))
    // Symbol/函数/Error/WeakMap/WeakSet/Promise/FormData 等语义对象按引用传递（不可安全克隆）
    if (
      value instanceof WeakMap || value instanceof WeakSet || value instanceof Promise ||
      value instanceof Error || (typeof FormData !== 'undefined' && value instanceof FormData)
    ) {
      return value
    }
    if (Object.prototype.toString.call(value) === '[object Arguments]') {
      return (function (..._args) {
        return arguments
      })(...[...value].map(deepClone))
    }
    const out = {}
    for (const k of Object.keys(value)) out[k] = deepClone(value[k])
    return out
  }
  return value
}
