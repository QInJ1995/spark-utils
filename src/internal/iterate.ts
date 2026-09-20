import { hasOwnProp, isArray } from './type'

/**
 * 数组迭代（移植自 src/array/arrayEach.js）
 *
 * - 有 forEach 走原生 forEach（context 作为 thisArg 传入）；
 * - 无 forEach 的类数组（如字符串，fixture 锁定）走索引循环，context 用 .call 绑定；
 * - 回调返回值不参与控制流；
 * - falsy 入参静默跳过。
 *
 * @param obj 数组（运行时兼容无 forEach 的类数组）
 * @param iterate(item, index, array) 回调
 * @param context 上下文
 * @returns 无返回值（忠实旧版 void 语义；falsy 入参静默跳过）
 */
export function arrayEach<T>(
  obj: T[] | null | undefined,
  iterate: (this: unknown, item: T, index: number, array: T[]) => boolean | void,
  context?: unknown
): void {
  if (obj) {
    if (typeof obj.forEach === 'function') {
      obj.forEach(iterate as (value: T, index: number, array: T[]) => void, context)
    } else {
      for (let index = 0; index < obj.length; index++) {
        iterate.call(context, obj[index] as T, index, obj)
      }
    }
  }
}

/**
 * 数组倒序迭代（移植自 src/array/lastArrayEach.js）
 *
 * 忠实旧实现：不做空值保护，null/undefined 直接读取 length 抛 TypeError
 * （test/fixtures/array/lastArrayEach.json 锁定该行为）。
 *
 * @param obj 数组
 * @param iterate(item, index, array) 回调
 * @param context 上下文
 * @returns 无返回值（忠实旧版 void 语义）
 */
export function lastArrayEach<T>(
  obj: T[] | null | undefined,
  iterate: (this: unknown, item: T, index: number, array: T[]) => boolean | void,
  context?: unknown
): void {
  const list = obj as T[]
  for (let len = list.length - 1; len >= 0; len--) {
    iterate.call(context, list[len] as T, len, list)
  }
}

/**
 * 对象迭代（移植自 src/object/objectEach.js）
 *
 * for-in + hasOwnProp 只遍历自有键；context 用 .call 绑定；
 * falsy 入参静默跳过。
 *
 * @param obj 对象（运行时兼容字符串等非数组可枚举值）
 * @param iterate(value, key, obj) 回调
 * @param context 上下文
 * @returns 无返回值（忠实旧版 void 语义；falsy 入参静默跳过）
 */
export function objectEach<T extends object>(
  obj: T | null | undefined,
  iterate: (this: unknown, item: T[keyof T], key: string, obj: T) => boolean | void,
  context?: unknown
): void {
  if (obj) {
    for (const key in obj) {
      if (hasOwnProp(obj, key)) {
        iterate.call(context, obj[key as keyof T], key, obj)
      }
    }
  }
}

/**
 * 对象倒序迭代（移植自 src/object/lastObjectEach.js）
 *
 * 旧实现为 keys(obj)（null → []，不抛错）后倒序遍历；
 * 新版用 Object.keys + 倒序循环等价实现。
 *
 * @param obj 对象
 * @param iterate(value, key, obj) 回调
 * @param context 上下文
 * @returns 无返回值（忠实旧版 void 语义；null 入参等价遍历空集，不抛错）
 */
export function lastObjectEach<T extends object>(
  obj: T | null | undefined,
  iterate: (this: unknown, item: T[keyof T], key: string, obj: T) => boolean | void,
  context?: unknown
): void {
  if (obj) {
    const keyList = Object.keys(obj)
    // Object.keys 快照元素恒为 string，as 断言仅为通过 noUncheckedIndexedAccess（与 arrayEach 的 obj[index] as T 同一惯用法）
    for (let len = keyList.length - 1; len >= 0; len--) {
      const key = keyList[len] as string
      iterate.call(context, obj[key as keyof T], key, obj)
    }
  }
}

/**
 * 迭代器（移植自 src/basic/each.js）
 *
 * 忠实旧分派语义：数组走 arrayEach，其余（含字符串）走 objectEach
 * 的 for-in + hasOwnProp；回调返回值不消费；truthy 入参遍历后返回
 * undefined（旧版返回分派函数的 undefined），falsy 入参原样返回。
 *
 * @param obj 对象/数组
 * @param iterate(item, key, obj) 回调
 * @param context 上下文
 */
export function each(
  obj: unknown,
  iterate: (this: unknown, item: unknown, key: string | number, obj: unknown) => boolean | void,
  context?: unknown
): unknown {
  if (obj) {
    if (isArray(obj)) {
      arrayEach(obj as unknown[], iterate, context)
    } else {
      objectEach(obj as object, iterate, context)
    }
    return undefined
  }
  return obj
}

/**
 * 迭代器，从最后开始迭代（移植自 src/basic/lastEach.js）
 *
 * 数组走 lastArrayEach，其余走 lastObjectEach；
 * truthy 入参遍历后返回 undefined，falsy 入参原样返回。
 *
 * @param obj 对象/数组
 * @param iterate(item, key, obj) 回调
 * @param context 上下文
 */
export function lastEach(
  obj: unknown,
  iterate: (this: unknown, item: unknown, key: string | number, obj: unknown) => boolean | void,
  context?: unknown
): unknown {
  if (obj) {
    if (isArray(obj)) {
      lastArrayEach(obj as unknown[], iterate, context)
    } else {
      lastObjectEach(obj as object, iterate, context)
    }
    return undefined
  }
  return obj
}
