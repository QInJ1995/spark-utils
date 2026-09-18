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
 * isWindow / isDocument 的 node 环境差异（M3 需登记 override）：
 * - 旧版在模块加载期求值 staticWindow/staticDocument（src/constant/static/*.js，node 下为数字 0）。
 * - isWindow 旧版在 node 下因 `staticWindow && ...` 短路返回数字 0（非 false）；
 *   新实现统一返回 boolean false，仅 truthiness 语义一致。
 * - isDocument 旧版在 node 下经 !! 归一化本就返回 false，新实现行为一致。
 * - 两者改为经 ../env 惰性求值（不依赖加载期全局存在）；浏览器下行为不变。
 *   极端差异：window 存在但缺 window.document 的环境中 isBrowser 为 false，
 *   新实现返回 false 而旧版可能返回 true。
 */
import { getSetup } from '../config'
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

/**
 * 判断是否闰年（旧 isLeapYear.js）
 * 依赖的 toStringDate/parseStringDate（src/date/toStringDate.js）为私有移植，
 * M2 date 模块落地后收敛；默认解析格式经 getSetup().formatDate 读取
 * （旧版读取可变单例 setupDefaults.formatDate，setup() 后生效的语义一致）。
 */
export function isLeapYear(date: unknown): boolean {
  const currentDate = date ? toStringDate(date) : new Date()
  if (isDate(currentDate)) {
    const year = currentDate.getFullYear()
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  }
  return false
}

/**
 * 判断属性中的键和值是否包含在对象中（旧 isMatch.js）
 * 依赖的 keys/includes/findIndexOf/isEqual（src/basic、src/array）为私有移植，
 * M2/M3 对应模块落地后收敛。
 */
export function isMatch(obj: unknown, source: unknown): boolean {
  const objKeys = keys(obj)
  const sourceKeys = keys(source)
  if (sourceKeys.length) {
    if (includeArrays(objKeys, sourceKeys)) {
      return (
        sourceKeys.some((key2) =>
          findIndexOf(
            objKeys,
            (key1) =>
              key1 === key2 &&
              isEqual((obj as Record<string, unknown>)[key1], (source as Record<string, unknown>)[key2]),
          ) > -1
        )
      )
    }
  } else {
    return true
  }
  return isEqual(obj, source)
}

/* ---------------------------------------------------------------------------
 * 以下为 isMatch / isLeapYear 的私有依赖移植（仅本文件内使用，不导出）
 * ------------------------------------------------------------------------- */

/** 旧 keys.js：Object.keys 可用时即 Object.keys，假值入参返回 [] */
function keys(obj: unknown): string[] {
  return obj ? Object.keys(obj as object) : []
}

/** 旧 includes.js：优先 obj.includes，否则 for-in + hasOwnProperty 逐值比对 */
function includes(obj: unknown, val: unknown): boolean {
  if (obj) {
    const target = obj as {
      includes?: (searchValue: unknown) => unknown
      hasOwnProperty?: (key: string) => boolean
    }
    if (target.includes) {
      return !!target.includes(val)
    }
    for (const key in obj as object) {
      if (target.hasOwnProperty && target.hasOwnProperty(key)) {
        if (val === (obj as Record<string, unknown>)[key]) {
          return true
        }
      }
    }
  }
  return false
}

/** 旧 includeArrays.js：两参均为数组时判断包含，否则退化为 includes */
function includeArrays(array1: unknown, array2: unknown): boolean {
  if (isArray(array1) && isArray(array2)) {
    for (const item of array2) {
      if (!includes(array1, item)) {
        return false
      }
    }
    return true
  }
  return includes(array1, array2)
}

/** 旧 findIndexOf.js 的数组路径（isMatch 中入参恒为 Object.keys 结果） */
function findIndexOf(arr: string[], iterate: (item: string) => boolean): number {
  for (let index = 0; index < arr.length; index++) {
    if (iterate(arr[index] as string)) {
      return index
    }
  }
  return -1
}

/** 旧 isEqual.js：深度比较（无自定义 compare，故省略 isEqualWith 的 func 透传路径） */
function isEqual(obj1: unknown, obj2: unknown): boolean {
  return helperEqualCompare(obj1, obj2)
}

/** 旧 helperDefaultCompare.js */
function helperDefaultCompare(v1: unknown, v2: unknown): boolean {
  return v1 === v2
}

/** 旧 helperEqualCompare.js（省略恒为空的 func 分支） */
function helperEqualCompare(val1: unknown, val2: unknown): boolean {
  if (val1 === val2) {
    return true
  }
  if (val1 && val2 && !isNumber(val1) && !isNumber(val2) && !isString(val1) && !isString(val2)) {
    if (isRegExp(val1)) {
      return helperDefaultCompare(`${val1}`, `${val2}`)
    }
    if (isDate(val1) || isBoolean(val1)) {
      return helperDefaultCompare(Number(val1), Number(val2))
    }
    const isObj1Arr = isArray(val1)
    const isObj2Arr = isArray(val2)
    if (
      isObj1Arr || isObj2Arr
        ? isObj1Arr && isObj2Arr
        : (val1 as object).constructor === (val2 as object).constructor
    ) {
      const val1Keys = keys(val1)
      const val2Keys = keys(val2)
      if (val1Keys.length === val2Keys.length) {
        return val1Keys.every(
          (key, index) =>
            key === val2Keys[index] &&
            helperEqualCompare(
              (val1 as Record<string, unknown>)[key],
              (val2 as Record<string, unknown>)[val2Keys[index] as string],
            ),
        )
      }
      return false
    }
  }
  return helperDefaultCompare(val1, val2)
}

/** 旧 toStringDate.js 的 dateFormatRules */
interface DateParseRule {
  rules: ReadonlyArray<readonly [string, number]>
  offset?: number
}

const dateFormatRules: readonly DateParseRule[] = [
  { rules: [['yyyy', 4], ['YYYY', 4]] },
  { rules: [['MM', 2], ['M', 1]], offset: -1 },
  { rules: [['DD', 2], ['dd', 2], ['d', 1]] },
  { rules: [['HH', 2], ['H', 1]] },
  { rules: [['mm', 2], ['m', 1]] },
  { rules: [['ss', 2], ['s', 1]] },
  { rules: [['SSS', 3], ['S', 1]] },
  { rules: [['ZZ', 5], ['Z', 6], ['Z', 5], ['Z', 1]] },
]

/** 旧 toStringDate.js 的 parseStringDate */
function parseStringDate(str: string, format: string): Array<string | number> {
  const dates: Array<string | number> = [0, 0, 1, 0, 0, 0, 0]
  let datesIndex = 0
  for (const fItem of dateFormatRules) {
    const rules = fItem.rules
    let ruleIndex = 0
    for (const arr of rules) {
      const sIndex = format.indexOf(arr[0])
      if (sIndex > -1) {
        const sub = str.substring(sIndex, sIndex + arr[1])
        if (sub && sub.length === arr[1]) {
          let tempMatch: string | number = sub
          if (fItem.offset) {
            tempMatch = parseInt(sub) + fItem.offset
          }
          dates[datesIndex] = tempMatch
          break
        }
      }
      if (ruleIndex === rules.length - 1) {
        return dates
      }
      ruleIndex++
    }
    datesIndex++
  }
  return dates
}

/** 旧 helperGetUTCDateTime.js */
function helperGetUTCDateTime(dates: ReadonlyArray<string | number>): number {
  return Date.UTC(
    dates[0] as number,
    dates[1] as number,
    dates[2] as number,
    dates[3] as number,
    dates[4] as number,
    dates[5] as number,
    dates[6] as number,
  )
}

/** 旧 toStringDate.js（isLeapYear 专用私有移植） */
function toStringDate(str: unknown, format?: string): Date {
  let rest: Date | undefined
  if (str) {
    const isDType = isDate(str)
    if (isDType || (!format && /^[0-9]{11,15}$/.test(str as string))) {
      rest = new Date(isDType ? (str as Date).getTime() : parseInt(str as string))
    } else if (isString(str)) {
      const dates = parseStringDate(str, format || getSetup().formatDate)
      const zStr = dates[7]
      if (dates[0]) {
        // 解析时区
        if (zStr) {
          // 如果为UTC 时间
          const zChar = (zStr as string)[0]
          if (zChar === 'z' || zChar === 'Z') {
            rest = new Date(helperGetUTCDateTime(dates))
          } else {
            // 如果指定时区，时区转换
            const tempMatch = (zStr as string).match(/([-+]{1})(\d{2}):?(\d{2})/)
            if (tempMatch) {
              rest = new Date(
                helperGetUTCDateTime(dates) -
                  (tempMatch[1] === '-' ? -1 : 1) * parseInt(tempMatch[2] as string) * 3600000 +
                  parseInt(tempMatch[3] as string) * 60000,
              )
            }
          }
        } else {
          rest = new Date(
            dates[0] as number,
            dates[1] as number,
            dates[2] as number,
            dates[3] as number,
            dates[4] as number,
            dates[5] as number,
            dates[6] as number,
          )
        }
      }
    }
  }
  return rest ? rest : new Date('')
}
