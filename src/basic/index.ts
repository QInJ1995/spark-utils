/**
 * basic —— 基础方法（2.0 严格 TS 版）
 *
 * - isXxx 家族 / isLeapYear / isMatch / getType：实现位于 ../internal/type，
 *   此处具名 re-export（不 export *：eqNull/hasOwnProp 为 internal 私有能力，
 *   不是公共 API——eqNull 仅供模块内如 toJSONString 使用）。
 * - 旧版“每方法一个文件 + 默认导出对象”的目录形态不再保留，
 *   全部为具名导出；keys/values/entries（原生镜像）已从 2.0 删除，
 *   uniqueId 无快照基线但方法保留。
 * - 2.0 起禁止 default 导出对象。
 */

/* -------------------------------- isXxx 家族 ------------------------------- */

/** 判断是否 Undefined */
export { isUndefined } from '../internal/type'
/** 判断是否 Null */
export { isNull } from '../internal/type'
/** 判断是否数组 */
export { isArray } from '../internal/type'
/** 判断是否 Array-like 的 Arguments */
export { isArguments } from '../internal/type'
/** 判断是否 Boolean */
export { isBoolean } from '../internal/type'
/** 判断是否 String */
export { isString } from '../internal/type'
/** 判断是否 Number */
export { isNumber } from '../internal/type'
/** 判断是否方法 */
export { isFunction } from '../internal/type'
/** 判断是否 Object（怪癖：null 也为 true） */
export { isObject } from '../internal/type'
/** 判断是否 RegExp */
export { isRegExp } from '../internal/type'
/** 判断是否 Date（含 Invalid Date） */
export { isDate } from '../internal/type'
/** 判断是否有效 Date */
export { isValidDate } from '../internal/type'
/** 判断是否 Error */
export { isError } from '../internal/type'
/** 判断是否 TypeError */
export { isTypeError } from '../internal/type'
/** 判断是否普通对象 */
export { isPlainObject } from '../internal/type'
/** 判断是否非数值（仅 number 类型的 NaN 为 true） */
export { isNaN } from '../internal/type'
/** 判断是否有限数 */
export { isFinite } from '../internal/type'
/** 判断是否整数（怪癖：'3'/true 也为 true） */
export { isInteger } from '../internal/type'
/** 判断是否小数（怪癖：'3.5'/Infinity 也为 true） */
export { isFloat } from '../internal/type'
/** 判断是否为空对象（原始值/null 均为 true） */
export { isEmpty } from '../internal/type'
/** 判断是否 Symbol */
export { isSymbol } from '../internal/type'
/** 判断是否 Map */
export { isMap } from '../internal/type'
/** 判断是否 WeakMap */
export { isWeakMap } from '../internal/type'
/** 判断是否 Set */
export { isSet } from '../internal/type'
/** 判断是否 WeakSet */
export { isWeakSet } from '../internal/type'
/** 判断是否 Promise（thenable 鸭子判定） */
export { isPromise } from '../internal/type'
/** 判断是否 Element */
export { isElement } from '../internal/type'
/** 判断是否 Document */
export { isDocument } from '../internal/type'
/** 判断是否 Window */
export { isWindow } from '../internal/type'
/** 判断是否 FormData */
export { isFormData } from '../internal/type'
/** 判断是否闰年 */
export { isLeapYear } from '../internal/type'
/** 判断属性中的键和值是否包含在对象中 */
export { isMatch } from '../internal/type'
/** 获取对象类型 */
export { getType } from '../internal/type'

/* ------------------------------ 迭代与比较 ------------------------------ */

/** 迭代器 */
export { each } from './each'
/** 迭代器，从最后开始迭代 */
export { lastEach } from './lastEach'
/** 深度比较两个对象之间的值是否相等 */
export { isEqual } from './isEqual'
/** 深度比较两个对象之间的值是否相等，使用自定义比较函数 */
export { isEqualWith } from './isEqualWith'
/** isEqualWith 的自定义比较函数类型 */
export type { EqualCustomizer } from './isEqualWith'
/** 比较两个日期（按格式化字符串比较） */
export { isDateSame } from './isDateSame'

/* ------------------------------ 集合与杂项 ------------------------------ */

/** 获取对象第一个值 */
export { first } from './first'
/** 获取对象最后一个值 */
export { last } from './last'
/** 返回对象的长度 */
export { getSize } from './getSize'
/** 序号列表生成函数 */
export { range } from './range'
/** 返回一个获取对象属性的函数 */
export { property } from './property'
/** 字符串转 JSON */
export { toStringJSON } from './toStringJSON'
/** JSON 转字符串 */
export { toJSONString } from './toJSONString'
/** 获取一个全局唯一标识 */
export { uniqueId } from './uniqueId'
/** 用于替代浏览器的 eval 方法 */
export { evalReplacer } from './evalReplacer'
