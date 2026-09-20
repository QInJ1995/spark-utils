import { eqNull, isArray, isFunction, isPlainObject } from '../internal/type'
import { arrayEach, each, objectEach } from '../internal/iterate'

/** 删除属性（旧 helpers/helperDeleteProperty.js：delete 失败时置 undefined） */
function deleteProperty(obj: Record<string, unknown>, key: string): void {
  try {
    delete obj[key]
  } catch {
    obj[key] = undefined
  }
}

/**
 * 清空对象（旧 src/object/clear.js 在 remove 场景下的内联：无 defs/assigns 形态）
 *
 * 普通对象删除全部自有键，数组长度归零，其余对象原样返回。
 */
function clearObject(obj: unknown): unknown {
  if (obj) {
    if (isPlainObject(obj)) {
      objectEach(obj as Record<string, unknown>, function clearKey(_val, key) {
        deleteProperty(obj as Record<string, unknown>, key)
      })
    } else if (isArray(obj)) {
      ;(obj as unknown[]).length = 0
    }
  }
  return obj
}

/**
 * 移除对象属性（移植自旧 src/array/remove.js）
 *
 * - iterate 为 null/undefined 时走 clear：清空并返回 obj 本身（fixture：[1,2,3] → []）；
 * - iterate 为函数时按回调命中；为其他值（字符串属性名）时按键名匹配（旧 pluckProperty 内联）；
 * - 数组：被移除元素倒序收集进返回数组（怪癖：[1,2,3,4] 移除 >2 得 [4,3]，
 *   fixture 锁定）；原数组正序单趟压缩抹除命中位（旧为逐键倒序 splice，
 *   2.0 性能改写，结果逐元素相同）；
 * - 对象：返回被移除键值组成的对象；
 * - obj 为空原样返回。
 *
 * 注意：会原地修改 obj。
 *
 * @param obj 对象/数组
 * @param iterate 方法或属性名
 * @param context 上下文
 * @returns 被移除的数据（数组返回数组，对象返回对象），无 iterate 时返回清空后的 obj
 */
export function remove<T>(
  obj: T[] | null | undefined,
  iterate:
    | ((this: unknown, item: T, index: number, array: T[]) => unknown)
    | string
    | number
    | null
    | undefined,
  context?: unknown
): T[]
export function remove<T extends object>(
  obj: T | null | undefined,
  iterate:
    | ((this: unknown, item: T[keyof T], key: string, obj: T) => unknown)
    | string
    | number
    | null
    | undefined,
  context?: unknown
): Partial<T>
export function remove(obj: unknown, iterate: unknown, context?: unknown): unknown {
  if (obj) {
    if (!eqNull(iterate)) {
      const removeKeys: Array<string | number> = []
      let rest: unknown = []
      const iterateFn = isFunction(iterate)
        ? (iterate as (this: unknown, item: unknown, key: string | number, obj: unknown) => unknown)
        : undefined
      const propName = iterateFn ? undefined : iterate
      each(obj, function collectRemoveKeys(item, index, restObj) {
        // 非函数 iterate 按属性名匹配（旧 pluckProperty：key === name）
        const matched = iterateFn
          ? iterateFn.call(context, item, index, restObj)
          : index === propName
        if (matched) {
          removeKeys.push(index)
        }
      })
      if (isArray(obj)) {
        const list = obj as unknown[]
        // 被移除值倒序收集（旧 lastEach(removeKeys) 语义，fixture 锁定）
        const removed = rest as unknown[]
        for (let len = removeKeys.length - 1; len >= 0; len--) {
          removed.push(list[removeKeys[len] as number])
        }
        // 2.0 性能：旧实现逐键倒序 splice（O(n·k)），改为正序单趟压缩
        //（O(n)，removeKeys 由 each 升序产出，双指针跳过命中位）
        let write = 0
        let keyPos = 0
        const keyCount = removeKeys.length
        for (let index = 0; index < list.length; index++) {
          if (keyPos < keyCount && removeKeys[keyPos] === index) {
            keyPos++
            continue
          }
          list[write] = list[index]
          write++
        }
        list.length = write
      } else {
        rest = {}
        const target = obj as Record<string, unknown>
        const removed = rest as Record<string, unknown>
        arrayEach(removeKeys, function removeKey(key) {
          removed[key] = target[key as string]
          deleteProperty(target, key as string)
        })
      }
      return rest
    }
    return clearObject(obj)
  }
  return obj
}
