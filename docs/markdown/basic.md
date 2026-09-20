# 基础方法

类型判定、迭代比较与集合工具。全部从主入口具名导入：

```ts
import { isString, isEqual, each } from 'spark-utils'
```

## 类型判定（isXxx 家族）

均为 `(value: unknown) => boolean` 签名，返回 `boolean`：

| 方法 | 说明 |
| --- | --- |
| `isString` / `isNumber` / `isBoolean` | 是否对应原始类型 |
| `isNull` / `isUndefined` | 是否 null / undefined |
| `isObject` | 是否对象（怪癖：`null` 也为 `true`，沿用旧版） |
| `isArray` / `isArguments` | 是否数组 / arguments |
| `isFunction` / `isPromise` | 是否函数 / Promise（thenable 鸭子判定） |
| `isDate` / `isValidDate` | 是否 Date / 有效 Date（`isDate` 含 Invalid Date） |
| `isRegExp` / `isError` / `isTypeError` / `isSymbol` | 是否对应类型 |
| `isPlainObject` | 是否普通对象字面量 |
| `isNaN` | 是否 NaN（仅 number 类型的 NaN 为 true） |
| `isFinite` / `isInteger` / `isFloat` | 是否有限数 / 整数 / 小数 |
| `isEmpty` | 是否空对象（`null`、`{}`、`[]`、`''` 等为 true） |
| `isMap` / `isWeakMap` / `isSet` / `isWeakSet` | 是否对应集合 |
| `isElement` / `isDocument` / `isWindow` | 是否 Element / Document / Window |
| `isFormData` | 是否 FormData |

::: tip 2.0 变更
`isWindow` 在 Node 下返回 `false`（旧版返回 `0`）。
:::

```ts
import { isString, isEmpty, isPlainObject } from 'spark-utils'

isString('abc')      // true
isString(1)          // false
isEmpty({})          // true
isEmpty([11, 22])    // false
isPlainObject([])    // false
```

## isLeapYear

判断是否闰年。

`isLeapYear(date: number | string | Date): boolean`

```ts
import { isLeapYear } from 'spark-utils'

isLeapYear('2020-12-01')            // true
isLeapYear('2018-12-01')            // false
isLeapYear(1606752000000)           // true
```

## isMatch

判断属性中的键和值是否包含在对象中。

`isMatch(obj: object, source: object): boolean`

```ts
import { isMatch } from 'spark-utils'

isMatch({ aa: 55, bb: 22 }, { bb: 22 })  // true
isMatch({ aa: 33, bb: 77 }, { bb: 55 })  // false
```

## isEqual

深度比较两个值是否相等。

`isEqual(value: unknown, other: unknown): boolean`

```ts
import { isEqual } from 'spark-utils'

isEqual({ a: 1 }, { a: 1 })        // true
isEqual({ a: 1 }, { a: 1, b: 1 })  // false
isEqual([1, 2], [1, 2])            // true
```

## isEqualWith

深度比较两个值是否相等，可自定义比较规则（回调返回 `true/false/undefined`，`undefined` 走默认比较）。

`isEqualWith(value, other, customizer?)`

```ts
import { isEqualWith } from 'spark-utils'

isEqualWith({ a: 1, b: 2 }, { a: 1 }, (a, b) =>
  typeof a === 'object' && typeof b === 'object' ? Object.keys(a).length === Object.keys(b).length : undefined,
)
```

## isDateSame

按格式化字符串比较两个日期是否相同。

`isDateSame(date1, date2, format?: string): boolean`

```ts
import { isDateSame } from 'spark-utils'

isDateSame('2023-12-01', '2023-12-01')        // true
isDateSame(new Date(), '2023-12-20', 'yyyy')  // 是否同年
isDateSame(new Date(), new Date(), 'MM')      // 是否同月
```

## getType

获取对象类型字符串。

`getType(value: unknown): string`

```ts
import { getType } from 'spark-utils'

getType([])             // 'array'
getType({})             // 'object'
getType(new Date())     // 'date'
getType(function(){})   // 'function'
getType(null)           // 'null'
```

## getSize

获取对象/数组/字符串的长度。

`getSize(value: unknown): number`

```ts
import { getSize } from 'spark-utils'

getSize('1234')            // 4
getSize([1, 3, 8, 3])      // 4
getSize({ a: 2, b: 5 })    // 2
```

## each / lastEach

通用迭代器（数组、对象、字符串、Map、Set 等）；`lastEach` 从最后一项开始。

`each(obj, iterate, context?)`

```ts
import { each, lastEach } from 'spark-utils'

each({ a: 1, b: 2 }, (item, key) => console.log(key, item))
each([1, 2, 3], (item, index) => console.log(index, item))
```

## first / last

获取数组或对象中的第一个 / 最后一个值。

`first(obj)` / `last(obj)`

```ts
import { first, last } from 'spark-utils'

first([1, 2, 3])       // 1
last([1, 2, 3])        // 3
first({ a: 2, b: 5 })  // 2
last({ a: 2, b: 5 })   // 5
```

## range

生成序号数组（含头不含尾）。

`range(stop?)` / `range(start, stop, step?)`

```ts
import { range } from 'spark-utils'

range(5)       // [0, 1, 2, 3, 4]
range(1, 5)    // [1, 2, 3, 4]
range(1, 5, 2) // [1, 3]
```

## uniqueId

生成全局唯一自增 ID（可选前缀）。

`uniqueId(prefix?)`

```ts
import { uniqueId } from 'spark-utils'

uniqueId()       // '1'
uniqueId('row')  // 'row2'
```

## toStringJSON / toJSONString

字符串转 JSON / JSON 转字符串（解析失败分别返回 `{}` / `''`）。

```ts
import { toStringJSON, toJSONString } from 'spark-utils'

toStringJSON('{"a":1,"b":2}')     // { a: 1, b: 2 }
toJSONString({ a: 1, b: 2 })      // '{"a":1,"b":2}'
```

## property

返回一个读取对象属性的函数。

`property(path: string)`

```ts
import { property } from 'spark-utils'

const getAge = property('age')
getAge({ name: 'spark', age: 25 })  // 25
getAge({ height: 176 })             // undefined
```

## evalReplacer

用于替代浏览器 `eval` 的表达式求值（非字符串入参原样返回）。

`evalReplacer(code: string): unknown`

```ts
import { evalReplacer } from 'spark-utils'

evalReplacer('1 + 2')  // 3
```

::: warning 2.0 已删除
`keys` / `values` / `entries` 已删除，请直接使用 `Object.keys` / `Object.values` / `Object.entries`。
:::
