/**
 * internal/type/guards —— 类型守卫（自 src/basic/is*.js 逐字移植）
 *
 * 移植说明：
 * - 行为（含怪癖）与旧版一致，已对照 test/fixtures/basic/*.json：
 *   - isObject(null) === true（typeof null === 'object'）
 *   - isInteger(true) / isInteger('3') === true（% 1 判定前的 isNaN 门卫是全局强转语义）
 *   - isFloat(Infinity) === true（Infinity % 1 为 NaN，非整数）
 *   - isEmpty(0) / isEmpty(null) === true（for-in 不迭代原始值）
 *   - isPlainObject / isTypeError 走 constructor === 构造函数 判定
 * - 旧 helperCreateInTypeof（typeof 探测）与 helperCreateInInObjectString
 *   （Object.prototype.toString）的判断语义在此以等价写法保留。
 * - 旧实现相互引用的（isFloat/isInteger -> isNull/isNaN/isArray、isValidDate -> isDate、
 *   isElement -> isString/isNumber 等）都在本文件内直接互调。
 * - isNaN/isFinite 与全局同名：本文件内需要全局强转语义（旧版 isNaN(obj)、isFinite(obj)）
 *   的一律写为 Number.isNaN(+x) / Number.isFinite(x)——一元 + 即 ToNumber，
 *   精确还原全局 isNaN 的强转（含 BigInt 抛错等边角行为）。
 *
 * 2.0 去重：isLeapYear / isMatch 曾在本文件双轨移植（连同 toStringDate 解析栈
 * 与深度比较栈共约 200 行私有依赖）；isLeapYear 现收敛至 ../datetime（与
 * canonical toStringDate 同文件），isMatch 收敛至公共域 basic/isMatch.ts
 * （深度比较直取 ../compare），本文件回归纯类型守卫。
 *
 * isWindow / isDocument 的 node 环境差异（M3 需登记 override）：
 * - 旧版在模块加载期求值 staticWindow/staticDocument（src/constant/static/*.js，node 下为数字 0）。
 * - isWindow 旧版在 node 下因 `staticWindow && ...` 短路返回数字 0（非 false）；
 *   新实现统一返回 boolean false，仅 truthiness 语义一致。
 * - isDocument 旧版在 node 下经 !! 归一化本就返回 false，新实现行为一致。
 * - 两者改为经 ../env 惰性求值（不依赖加载期全局存在）；浏览器下行为不变。
 *   极端差异：window 存在但缺 window.document 的环境中 isBrowser 为 false，
 *   新实现返回 false 而旧版可能返回 true。
 */
import { getDocument, getWindow } from '../env'

const objectToString = Object.prototype.toString

/** 旧 helperCreateInInObjectString：'[object ' + tag + ']' === toString.call(value) */
function isObjectStringTag(value: unknown, tag: string): boolean {
  return objectToString.call(value) === `[object ${tag}]`
}

/** 判断是否 Undefined（旧 isUndefined.js，helperCreateInTypeof('undefined')） */
export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined'
}

/** 判断是否 Null（旧 isNull.js） */
export function isNull(value: unknown): value is null {
  return value === null
}

/** 判断是否数组（旧 isArray.js：Array.isArray） */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value)
}

/** 判断是否 Array-like 的 Arguments（旧 isArguments.js，[object Arguments]） */
export function isArguments(value: unknown): value is IArguments {
  return isObjectStringTag(value, 'Arguments')
}

/** 判断是否 Boolean（旧 isBoolean.js，typeof 'boolean'） */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/** 判断是否 String（旧 isString.js，typeof 'string'） */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/** 判断是否 Number（旧 isNumber.js，typeof 'number'） */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

/** 判断是否方法（旧 isFunction.js，typeof 'function'） */
export function isFunction(value: unknown): value is (...args: never[]) => unknown {
  return typeof value === 'function'
}

/** 判断是否 Object（旧 isObject.js，typeof 'object'——怪癖：null 也为 true） */
export function isObject(value: unknown): value is object {
  return typeof value === 'object'
}

/** 判断是否 RegExp（旧 isRegExp.js，[object RegExp]） */
export function isRegExp(value: unknown): value is RegExp {
  return isObjectStringTag(value, 'RegExp')
}

/** 判断是否 Date（旧 isDate.js，[object Date]——含 Invalid Date） */
export function isDate(value: unknown): value is Date {
  return isObjectStringTag(value, 'Date')
}

/** 判断是否有效 Date（旧 isValidDate.js：isDate 且 getTime() 非 NaN） */
export function isValidDate(value: unknown): value is Date {
  return isDate(value) && !Number.isNaN(value.getTime())
}

/** 判断是否 Error（旧 isError.js，[object Error]） */
export function isError(value: unknown): value is Error {
  return isObjectStringTag(value, 'Error')
}

/** 判断是否 TypeError（旧 isTypeError.js：constructor === TypeError） */
export function isTypeError(value: unknown): value is TypeError {
  return value ? (value as { constructor?: unknown }).constructor === TypeError : false
}

/** 判断是否普通对象（旧 isPlainObject.js：constructor === Object） */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value ? (value as { constructor?: unknown }).constructor === Object : false
}

/**
 * 判断是否 NaN（旧 isNaN.js：isNumber(obj) && isNaN(obj)，全局 isNaN 强转被 isNumber 门卫挡住）
 * 仅真正的 number 类型 NaN 返回 true。
 */
export function isNaN(value: unknown): value is number {
  return isNumber(value) && Number.isNaN(value)
}

/** 判断是否有限数（旧 isFinite.js：isNumber(obj) && isFinite(obj)） */
export function isFinite(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value)
}

/**
 * 判断是否整数（旧 isInteger.js）
 * 怪癖忠实保留：!isNull && !isNaN(obj)（全局强转）&& !isArray && obj % 1 === 0，
 * 因此 isInteger('3') / isInteger(true) 均为 true，返回 boolean 而非类型守卫。
 */
export function isInteger(value: unknown): boolean {
  return (
    !isNull(value) && !Number.isNaN(+(value as number)) && !isArray(value) && (value as number) % 1 === 0
  )
}

/**
 * 判断是否小数（旧 isFloat.js）
 * 怪癖忠实保留：非 null、非 NaN（全局强转）、非数组且非 isInteger，
 * 因此 isFloat('3.5') / isFloat(Infinity) 均为 true。
 */
export function isFloat(value: unknown): boolean {
  return !isNull(value) && !Number.isNaN(+(value as number)) && !isArray(value) && !isInteger(value)
}

/** 判断是否为空对象（旧 isEmpty.js：for-in 可迭代到任意键即非空；原始值/null 均为 true） */
export function isEmpty(value: unknown): boolean {
  for (const _key in value as object) {
    return false
  }
  return true
}

/** 判断是否 Symbol（旧 isSymbol.js：优先 Symbol.isSymbol（若存在），否则 typeof 'symbol'） */
const supportSymbol = typeof Symbol !== 'undefined'
const symbolIsSymbol: ((value: unknown) => boolean) | undefined = supportSymbol
  ? (Symbol as { isSymbol?: (value: unknown) => boolean }).isSymbol
  : undefined

export function isSymbol(value: unknown): value is symbol {
  return symbolIsSymbol ? symbolIsSymbol(value) : typeof value === 'symbol'
}

/** 判断是否 Map（旧 isMap.js：支持探测 + instanceof） */
const supportMap = typeof Map !== 'undefined'

export function isMap(value: unknown): value is Map<unknown, unknown> {
  return supportMap && value instanceof Map
}

/** 判断是否 WeakMap（旧 isWeakMap.js） */
const supportWeakMap = typeof WeakMap !== 'undefined'

export function isWeakMap(value: unknown): value is WeakMap<object, unknown> {
  return supportWeakMap && value instanceof WeakMap
}

/** 判断是否 Set（旧 isSet.js） */
const supportSet = typeof Set !== 'undefined'

export function isSet(value: unknown): value is Set<unknown> {
  return supportSet && value instanceof Set
}

/** 判断是否 WeakSet（旧 isWeakSet.js） */
const supportWeakSet = typeof WeakSet !== 'undefined'

export function isWeakSet(value: unknown): value is WeakSet<object> {
  return supportWeakSet && value instanceof WeakSet
}

/**
 * 判断是否 Promise（旧 isPromise.js：thenable 鸭子判定）
 * 主包无 DOM/专有 lib，仅依赖 ES2015 的 PromiseLike 结构类型。
 */
export function isPromise(value: unknown): value is PromiseLike<unknown> {
  return !!value && typeof (value as { then?: unknown }).then === 'function'
}

/**
 * 判断是否 Element（旧 isElement.js：nodeName 为 string 且 nodeType 为 number 的鸭子判定）
 * 主包无 DOM lib，用最小结构类型局部断言，不声明全局 DOM 类型。
 */
export function isElement(value: unknown): boolean {
  if (!value) {
    return false
  }
  const node = value as { nodeName?: unknown; nodeType?: unknown }
  return !!(isString(node.nodeName) && isNumber(node.nodeType))
}

/**
 * 判断是否 Document（旧 isDocument.js：!!(obj && staticDocument && obj.nodeType === 9)）
 * staticDocument 改为经 ../env 惰性求值：node 下 getDocument() 为 undefined，恒 false（与旧版 node 行为一致）。
 */
export function isDocument(value: unknown): boolean {
  const doc = getDocument()
  return !!(value && doc && (value as { nodeType?: unknown }).nodeType === 9)
}

/**
 * 判断是否 Window（旧 isWindow.js：staticWindow && !!(obj && obj === obj.window)）
 * staticWindow 改为经 ../env 惰性求值。
 * 差异（M3 登记 override）：旧版 node 下 staticWindow 为数字 0，短路返回 0；
 * 新实现 getWindow() 为 undefined，返回 false。
 */
export function isWindow(value: unknown): boolean {
  const win = getWindow()
  return !!(win && value && value === (value as { window?: unknown }).window)
}

/**
 * 判断是否 FormData（旧 isFormData.js：加载期 typeof FormData 探测 + instanceof）
 * 主包无 DOM lib，经 globalThis 最小结构类型取构造函数，不声明全局 FormData 类型。
 */
type FormDataConstructor = new (...args: never[]) => object
const supportFormData =
  typeof (globalThis as { FormData?: unknown }).FormData !== 'undefined'
const formDataConstructor: FormDataConstructor | undefined = supportFormData
  ? (globalThis as { FormData?: FormDataConstructor }).FormData
  : undefined

export function isFormData(value: unknown): boolean {
  return formDataConstructor !== undefined && value instanceof formDataConstructor
}
