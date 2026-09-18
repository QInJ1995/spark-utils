/**
 * 清空对象（移植自旧 src/object/clear.js）
 *
 * 忠实旧语义（fixtures/object/clear.json 锁定）：
 * - defs 判定沿用旧"是否传了第二参且非对象"（isNull(defs) || !isObject(defs)）：
 *   传标量/null/undefined → 逐键（数组逐索引）填充 defs；传对象 → 删除全部属性；
 * - 第三参（或 defs 为对象时的第二参）作为继承源：对象走 assign，数组走 push 追加；
 * - 非普通对象非数组的 truthy 入参不处理；falsy 入参原样返回。
 * 旧 helperDeleteProperty（delete 失败回写 undefined）在此内联。
 */
import { objectEach } from '../internal/iterate'
import { isArray, isNull, isObject, isPlainObject } from '../internal/type'
import { assign } from './assign'

/**
 * 删除对象属性，删除失败（不可配置属性）时回写 undefined
 *
 * @param obj 对象
 * @param property 属性名
 */
function helperDeleteProperty(obj: Record<string, unknown>, property: string): void {
  try {
    delete obj[property]
  } catch {
    obj[property] = undefined
  }
}

/**
 * 清空对象
 *
 * @param obj 对象/数组
 * @param defsAndAssigns [defs, assigns]：defs 默认值（不传清空所有属性、传对象清空并继承、传标量逐键赋值）；assigns 继承源
 * @returns 原对象
 */
export function clear(obj: unknown, ...defsAndAssigns: unknown[]): unknown {
  if (obj) {
    const defs = defsAndAssigns[0]
    const assigns = defsAndAssigns[1]
    // 旧版以 arguments.length > 1 判定"传了 defs"（显式传 undefined 也算）
    const isDefs = defsAndAssigns.length > 0 && (isNull(defs) || !isObject(defs))
    const extds = isDefs ? assigns : defs
    if (isPlainObject(obj)) {
      const record = obj
      objectEach(record, isDefs ? (_val: unknown, key: string) => { record[key] = defs } : (_val: unknown, key: string) => { helperDeleteProperty(record, key) })
      if (extds) {
        assign(record, extds)
      }
    } else if (isArray(obj)) {
      const list = obj as unknown[]
      if (isDefs) {
        let len = list.length
        while (len > 0) {
          len--
          list[len] = defs
        }
      } else {
        list.length = 0
      }
      if (extds) {
        list.push(...(extds as unknown[]))
      }
    }
  }
  return obj
}
