/**
 * 浅拷贝/深拷贝（移植自旧 src/object/clone.js）
 *
 * 忠实旧语义（fixtures/object/clone.json 锁定）：
 * - 普通对象经 objectMap 克隆、数组经原生 map 克隆（浅拷贝仅复制一层引用）；
 * - 深拷贝递归复制普通对象与数组，另对 Date/RegExp（new ctor(valueOf())）、
 *   Set/Map（逐项重建）做同构造器复制；
 * - 其他值（含非普通对象）深浅拷贝均原样返回；falsy 入参原样返回。
 * 旧版经 handleObjectAndArrayClone 分派 map/objectMap 的结构在此内联。
 */
import { isArray, isPlainObject } from '../internal/type'
import { objectMap, type ObjectMapIterator } from './objectMap'

const objectToString = Object.prototype.toString

/**
 * 深拷贝时的特殊值复制（Date/RegExp/Set/Map），其余原样返回
 *
 * @param val 待复制的值
 * @param deep 是否深拷贝
 */
function handleValueClone(val: unknown, deep: boolean | undefined): unknown {
  if (deep && val) {
    switch (objectToString.call(val)) {
      case '[object Date]':
      case '[object RegExp]': {
        const ctor = (val as object).constructor as new (value: unknown) => object
        return new ctor((val as object).valueOf())
      }
      case '[object Set]': {
        const ctor = (val as object).constructor as new () => Set<unknown>
        const set = new ctor()
        ;(val as Set<unknown>).forEach((item) => {
          set.add(item)
        })
        return set
      }
      case '[object Map]': {
        const ctor = (val as object).constructor as new () => Map<unknown, unknown>
        const map = new ctor()
        ;(val as Map<unknown, unknown>).forEach((item, key) => {
          map.set(key, item)
        })
        return map
      }
    }
  }
  return val
}

/**
 * 复制单个值：普通对象/数组递归克隆，其余交 handleValueClone
 *
 * @param val 待复制的值
 * @param deep 是否深拷贝
 */
function copyValue(val: unknown, deep: boolean | undefined): unknown {
  if (isPlainObject(val)) {
    const iterate: ObjectMapIterator = deep
      ? (item: unknown) => copyValue(item, deep)
      : (item: unknown) => item
    return objectMap(val, iterate)
  }
  if (isArray(val)) {
    return val.map(deep ? (item: unknown) => copyValue(item, deep) : (item: unknown) => item)
  }
  return handleValueClone(val, deep)
}

/**
 * 浅拷贝/深拷贝
 *
 * @param obj 对象/数组
 * @param deep 是否深拷贝
 * @returns 拷贝后的值（falsy 入参原样返回）
 */
export function clone(obj: unknown, deep?: boolean): unknown {
  if (obj) {
    return copyValue(obj, deep)
  }
  return obj
}
