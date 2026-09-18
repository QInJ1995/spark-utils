/**
 * internal/type/misc —— 类型相关杂项
 * 自 src/basic/getType.js、eqNull.js、hasOwnProp.js 逐字移植，行为见 test/fixtures/basic/getType.json。
 */
import { isArray, isDate, isError, isNull, isRegExp, isSymbol, isUndefined } from './guards'

/**
 * 获取对象类型（旧 getType.js）
 * 判定顺序忠实保留：null -> symbol -> date -> array -> regexp -> error -> typeof。
 */
export function getType(value: unknown): string {
  if (isNull(value)) {
    return 'null'
  }
  if (isSymbol(value)) {
    return 'symbol'
  }
  if (isDate(value)) {
    return 'date'
  }
  if (isArray(value)) {
    return 'array'
  }
  if (isRegExp(value)) {
    return 'regexp'
  }
  if (isError(value)) {
    return 'error'
  }
  return typeof value
}

/** 判断是否 undefined 和 null（旧 eqNull.js） */
export function eqNull(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value)
}

/**
 * 判断对象自身属性中是否具有指定的属性（旧 hasOwnProp.js）
 * 忠实保留 obj.hasOwnProperty 方法调用（可被子类覆盖），而非 Object.prototype.hasOwnProperty.call。
 */
export function hasOwnProp(obj: object, key: string): boolean {
  const target = obj as { hasOwnProperty?: (key: string) => boolean } | null | undefined
  return target && target.hasOwnProperty ? target.hasOwnProperty(key) : false
}
