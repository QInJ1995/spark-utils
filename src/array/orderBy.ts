import { arrayEach } from '../internal/iterate'
import { getValueByPath } from '../internal/paths'
import { eqNull, isArray, isFunction, isNull, isPlainObject, isUndefined } from '../internal/type'
import { map } from './map'
import { toArray } from './toArray'

/** 升序标记（旧 ORDER_PROP_ASC） */
const ORDER_PROP_ASC = 'asc'
/** 降序标记（旧 ORDER_PROP_DESC） */
const ORDER_PROP_DESC = 'desc'

/** 单字段排序配置（旧 getSortConfs 产出的 { field, order }） */
interface SortConf {
  field: unknown
  order: string
}

/** 排序包装项：data 为原值，数字键 0..n 为各字段预取值（旧 { data: item } 形态） */
type SortItem = { data: unknown } & Record<number, unknown>

/** 排序字段配置：函数 / 属性路径 / [field, order] 数组 / { field, order } 对象 */
export type OrderFieldConf =
  | string
  | number
  | ((this: unknown, item: unknown, index: number, arr: unknown) => unknown)
  | ReadonlyArray<unknown>
  | Record<string, unknown>

/** 单层比较（旧 handleSort）：'' < 数字 < 字符 < null < undefined */
function handleSort(v1: unknown, v2: unknown): number {
  if (isUndefined(v1)) {
    return 1
  }
  if (isNull(v1)) {
    return isUndefined(v2) ? -1 : 1
  }
  const str1 = v1 as { localeCompare?: (other: string) => number }
  return str1 && str1.localeCompare ? str1.localeCompare(v2 as string) : (v1 as number) > (v2 as number) ? 1 : -1
}

/**
 * 依序比对全部排序字段（旧 buildMultiOrders 闭包链的等价展开：
 * 字段值相等时落到下一字段，全部相等返回 0；
 * desc 时交换参数再比较——不建闭包工厂的性能优化写法）。
 */
function compareMultiOrders(sortConfs: SortConf[], item1: SortItem, item2: SortItem): number {
  for (let index = 0, len = sortConfs.length; index < len; index++) {
    const conf = sortConfs[index] as SortConf
    const v1 = item1[index]
    const v2 = item2[index]
    if (v1 !== v2) {
      return conf.order === ORDER_PROP_DESC ? handleSort(v2, v1) : handleSort(v1, v2)
    }
  }
  return 0
}

/**
 * 归一化字段配置并把各字段值预取到包装项的数字键上（旧 getSortConfs）
 *
 * - fieldConfs 非数组时包一层；逐个配置项处理（falsy 跳过）；
 * - 数组配置取 [field, order]，普通对象配置取 { field, order }，order 缺省 'asc'；
 * - 函数 field 以 (item.data, key, arr) 调用；字符串路径经 get 取值；
 *   falsy field 直接用原值 item.data。
 */
function getSortConfs(
  arr: unknown,
  list: SortItem[],
  fieldConfs: OrderFieldConf | ReadonlyArray<OrderFieldConf>,
  context: unknown
): SortConf[] {
  const sortConfs: SortConf[] = []
  const confList = (isArray(fieldConfs) ? fieldConfs : [fieldConfs]) as unknown[]
  arrayEach(confList, function parseSortConf(handle, index) {
    if (handle) {
      let field: unknown = handle
      let order: unknown
      if (isArray(handle)) {
        field = (handle as unknown[])[0]
        order = (handle as unknown[])[1]
      } else if (isPlainObject(handle)) {
        field = (handle as Record<string, unknown>).field
        order = (handle as Record<string, unknown>).order
      }
      sortConfs.push({ field, order: (order as string) || ORDER_PROP_ASC })
      arrayEach(
        list,
        isFunction(field)
          ? function applyFieldFn(item, key) {
              item[index] = (field as (this: unknown, data: unknown, key: number, arr: unknown) => unknown).call(
                context,
                item.data,
                key,
                arr
              )
            }
          : function applyFieldPath(item) {
              item[index] = field ? getValueByPath(item.data, field as string | number) : item.data
            }
      )
    }
  })
  return sortConfs
}

/**
 * 将数组进行排序（移植自旧 src/array/orderBy.js）
 *
 * - fieldConfs 为 null/undefined 时按值升序（handleSort）；
 * - 否则包装为 { data } 列表、预取字段值、按字段优先级排序后取回 data；
 * - arr 为空返回 []。
 *
 * @param arr 数组
 * @param fieldConfs 方法或属性（支持函数/字符串/数字/[field, order]/{ field, order }）
 * @param context 上下文
 * @returns 排序后的新数组
 */
export function orderBy<T>(
  arr: ReadonlyArray<T> | Record<string, T> | null | undefined,
  fieldConfs?: OrderFieldConf | ReadonlyArray<OrderFieldConf> | null,
  context?: unknown
): T[] {
  if (arr) {
    if (eqNull(fieldConfs)) {
      return (toArray(arr) as T[]).sort(handleSort)
    }
    let list = map(arr, function wrapSortItem(item) {
      return { data: item } as SortItem
    })
    const sortConfs = getSortConfs(arr, list, fieldConfs as OrderFieldConf, context)
    if (sortConfs.length) {
      list = list.sort(function compareItems(item1, item2) {
        return compareMultiOrders(sortConfs, item1, item2)
      })
    }
    return map(list, function pluckData(item) {
      return item.data
    }) as T[]
  }
  return []
}
