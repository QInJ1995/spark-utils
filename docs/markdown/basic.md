# 基础方法

## isString

判断是否 String 对象

### 参数

`isString(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isString } from 'spark-utils';

isString(1) // false
isString(true) // false
isString('') // true
isString('abc') // true

```

## isNaN

判断是否非数值，如果 value 是一个 NaN，那么返回 true，否则返回 false

### 参数

`isNaN(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isNaN } from 'spark-utils';

isNaN(undefined) // false
isNaN(NaN) // true

```

## isNumber

判断是否 Number 对象

### 参数

`isNumber(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isNumber } from 'spark-utils';

isNumber(1); // true
isNumber('1'); // false
isNumber(null) // false

```

## isBoolean

判断是否 Boolean 对象

### 参数

`isBoolean(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isBoolean } from 'spark-utils';

isBoolean(false); // true
isBoolean('false') // false

```
    
## isNull

判断是否为 Null

### 参数

`isNull(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例       

```js
import { isNull } from 'spark-utils';

isNull(null); // true
isNull(0) // false
isNull('') // false
isNull(undefined); // true

```

## isUndefined

判断是否为 undefined

### 参数

`isUndefined(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isUndefined } from 'spark-utils';

isUndefined(undefined); // true
isUndefined() // true

```

## isObject

判断是否 Object 对象

### 参数

`isObject(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isObject } from 'spark-utils';

isObject({}); // true
isObject([]); // true
isObject(123) // false
isObject(null) // true

```

## isArray

判断是否为数组

### 参数

`isArray(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isArray } from 'spark-utils';
isArray({}) // false
isArray([]); // true
isArray(null) // false

```

## isFunction

判断是否为函数

### 参数

`isFunction(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isFunction } from 'spark-utils';

isFunction(() => {}); // true

```

## isPromise

判断是否为 Promise 对象

### 参数

`isPromise(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isPromise } from 'spark-utils';

isPromise(new Promise(() => {})); // true

```

## isDate

判断是否 Date 对象，如果是无效日期 Invalid Date 也返回 true

### 参数

`isDate(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isDate } from 'spark-utils';

isDate(new Date()); // true
isDate('2023-12-20') // false
isDate(1514096716811) // false
isDate(new Date('aaa')) // Invalid Date => true

```

## isRegExp

判断是否为 RegExp 对象

### 参数

`isRegExp(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isRegExp } from 'spark-utils';

isRegExp(/^1/); // true
isRegExp(new RegExp('abc')) // true

```

## isError

判断是否为 Error 对象

### 参数

`isError(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isError } from 'spark-utils';

isError(null) // false
isError(new Error()); // true
isError({}) // false
isError(new TypeError('error')) // true

```

## isSymbol

判断是否为 Symbol 对象

### 参数

`isSymbol(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isSymbol } from 'spark-utils';

isSymbol(Symbol()); // true
isSymbol('123'); // false

```

## isEmpty

判断是否为空对象

### 参数

`isEmpty(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
        
import { isEmpty } from 'spark-utils';

isEmpty([11, 22]) // false
isEmpty({a:null}) // false
isEmpty(null) // true
isEmpty({}) // true
isEmpty([]) // true

```

## isFinite

判断是否为有限数

### 参数

`isFinite(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isFinite } from 'spark-utils';

isFinite(1); // true
isFinite(Infinity); // false

```

## isFloat

判断是否为浮点数

### 参数

`isFloat(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isFloat } from 'spark-utils';

isFloat(1.1); // true
isFloat(1); // false

```

## isInteger

判断是否为整数

### 参数

`isInteger(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isInteger } from 'spark-utils';

isInteger(1); // true
isInteger(1.1); // false

```

## isPlainObject

判断是否是一个对象

### 参数

`isPlainObject(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
import { isPlainObject } from 'spark-utils';

isPlainObject(null) // false
isPlainObject([]) // false
isPlainObject(123) // false
isPlainObject({}) // true

```

## isValidDate

和 isDate 的区别是同时判断类型与有效日期，如果为无效日期 Invalid Date 则返回 false

### 参数

`isValidDate(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isValidDate } from 'spark-utils';

isValidDate(new Date()); // true
isValidDate('2023-12-20') // false
isValidDate(1514096716811) // false
isValidDate(new Date('aaa')) // Invalid Date => false

```

## isTypeError

判断是否为 TypeError 对象

### 参数

`isTypeError(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js

import { isTypeError } from 'spark-utils';

isTypeError(null) // false
isTypeError({}) // false
isTypeError(new Error('error')) // false
isTypeError(new TypeError('error')) // true
isTypeError(new TypeError()); // true

```

## isArguments

判断是否为 arguments 对象

### 参数

`isArguments(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isArguments } from 'spark-utils';

isArguments([]) // false
isArguments(arguments); // true

```

## isElement

判断是否为 Element 对象

### 参数

`isElement(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isElement } from 'spark-utils';

isElement(document.body); // true
isDocument(document) // true
isDocument({}) // false

```

## isWindow

判断是否为 window 对象

### 参数

`isWindow(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isWindow } from 'spark-utils';

isWindow(window); // true
isWindow({}) // false
isWindow(document) // false

```

## isDocument

判断是否为 document 对象

### 参数

`isDocument(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isDocument } from 'spark-utils';

isDocument(document); // true
isDocument(document.createElement('div')) // false
isDocument({}) // false

```

## isFormData

判断是否为 FormData 对象

### 参数

`isFormData(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isFormData } from 'spark-utils';

isFormData(new FormData()); // true
isFormData({}) // false

```

## isMap

判断是否为 Map 对象

### 参数

`isMap(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isMap } from 'spark-utils';

isMap(new Map()); // true
isMap({}) // false

```

## isWeakMap

判断是否为 WeakMap 对象

### 参数

`isWeakMap(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isWeakMap } from 'spark-utils';

isWeakMap(new WeakMap()); // true
isWeakMap({}) // false

```

## isSet

判断是否为 Set 对象

### 参数

`isSet(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isSet } from 'spark-utils';

isSet(new Set()); // true
isSet({}) // false

```

## isWeakSet

判断是否为 WeakSet 对象

### 参数

`isWeakSet(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isWeakSet } from 'spark-utils';

isWeakSet(new WeakSet()); // true
isWeakSet({}) // false

```

## isEqual

深度比较两个对象之间的值是否相等

### 参数

`isEqual(value, other)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |
| other | * | 是 | 需要判断的值 |

### 返回

`boolean`

### 示例

```js
    
import { isEqual } from 'spark-utils';

isEqual({a:1}, {a:1}) // true
isEqual({a:1}, {a:2}) // false
isEqual({a:1}, {b:1}) // false
isEqual({a:1}, {a:1, b:1}) // false

```

## isEqualWith

深度比较两个对象之间的值是否相等，可以自定义比较规则

### 参数

`isEqualWith(value, other, [customizer])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |
| other | * | 是 | 需要判断的值 |
| customizer | Function | 否 | 自定义比较规则 |

### 返回

`boolean`

### 示例

```js
    
import { isEqualWith } from 'spark-utils';

isEqualWith({a:1}, {a:1}, (a, b) => {
    return a.a === b.a;
}) // true

isEqualWith({a:1}, {a:1}, (a, b) => {
    return a === b;
}) // false

```

## isLeapYear

判断是否为闰年

### 参数

`isLeapYear(year)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| year | number/string/Date | 是 | 需要判断的年份 |

### 返回

`boolean`

### 示例

```js
    
import { isLeapYear } from 'spark-utils';

isLeapYear(1606752000000)  // true
isLeapYear('2018-12-01') // false
isLeapYear('2020-12-01') // true
isLeapYear(new Date('2020/12/01')) // true
```

## isMatch

判断属性中的键和值是否包含在对象中

### 参数

`isMatch(obj, source)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | Object | 是 | 对象 |
| source | Object | 是 | 匹配对象 |

### 返回

`boolean`

### 示例

```js
    
import { isMatch } from 'spark-utils';

isMatch({ aa: 33, bb: 77 }, { bb: 55 })  // false
isMatch({ aa: 55, bb: 22 }, { bb: 22 })  // true

```

## isDateSame

判断两个日期是否相同

### 参数

`isDateSame(date1, date2, format)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date1 | Date/string/number | 是 | 需要判断的日期 |
| date2 | Date/string/number | 是 | 需要判断的日期 |
| format | string | 是 | 需要判断的日期 |

### 返回

`boolean`

### 示例

```js
    
import { isDateSame, toStringDate } from 'spark-utils';

isDateSame('2023-12-01', '2023-12-01') // true
isDateSame(new Date(), '2023-12-01', 'yyyy') // 判断是否同一年 true
isDateSame(new Date(), toStringDate('12/30/2018', 'MM/dd/yyyy'), 'MM') // 判断是否同一月 true
isDateSame(new Date(), new Date(), 'dd') // 判断是否同一日 true
isDateSame(new Date(), new Date(), 'yyyyMMdd') // 判断是否同年同月同日 true

```

## getType

获取对象类型

### 参数

`getType(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`string`

### 示例

```js
    
import { getType } from 'spark-utils';

getType(null) // 'null'
getType(123) // 'number'
getType() // 'undefined'
getType('123') // 'string'
getType([]) // 'array'
getType({}) // 'object'
getType(new Date()) // 'date'
getType(new RegExp()) // 'regexp'
getType(/abc/) // 'regexp'
getType(new Error()) // 'error'
getType(function(){}) // 'function'
getType(new TypeError()) // 'typeerror'

```

## getSize

获取对象的长度

### 参数

`getSize(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要判断的值 |

### 返回

`number`

### 示例

```js
    
import { getSize } from 'spark-utils';

getSize('1234') // 4
getSize([1, 3, 8, 3]) // 4
getSize({a: 2, b: 5}) // 2

```

## keys

获取对象的所有键

### 参数

`keys(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | object | 是 | 处理的对象 |

### 返回

`Array`

### 示例

```js
    
import { keys } from 'spark-utils';

keys({a: 2, b: 5}) // ['a', 'b']

```

## values

获取对象的所有值

### 参数

`values(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | object | 是 | 处理的对象 |

### 返回

`Array`

### 示例

```js
    
import { values } from 'spark-utils';

values({a: 2, b: 5}) // [2, 5]

```

## entries

获取对象的所有键值对

### 参数

`entries(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | object | 是 | 需要处理的对象 |

### 返回

`Array`

### 示例

```js
    
import { entries } from 'spark-utils';

entries({a: 2, b: 5}) // [['a', 2], ['b', 5]]
entries([1, 2]) // [['0', 1], ['1', 2]]

```

## first

获取数组或对象中的第一个元素

### 参数

`first(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | object/array | 是 | 需要处理的对象或数组 |

### 返回

`*`

### 示例

```js
    
import { first } from 'spark-utils';

first([1, 2, 3]) // 1
first({a: 2, b: 5}) // {a: 2}

```

## last

获取数组或对象中的最后一个元素

### 参数

`last(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | object/array | 是 | 需要处理的对象或数组 |

### 返回

`*`

### 示例

```js
    
import { last } from 'spark-utils';

last([1, 2, 3]) // 3
last({a: 2, b: 5}) // {b: 5}

```

## each

通用迭代器

### 参数

`each(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 遍历对象 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`void`

### 示例

```js
    
import { each } from 'spark-utils';

each([1, 2, 3], (item, index) => {
    console.log(item, index);
})

```

## lastEach

通用迭代器，从后往前遍历

### 参数

`lastEach(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 遍历对象 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`void`

### 示例

```js
    
import { lastEach } from 'spark-utils';

lastEach([1, 2, 3], (item, index) => {
    console.log(item, index);
})

```

## uniqueId

生成一个唯一的ID

### 参数

`uniqueId([prefix])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| prefix | string | 否 | 生成ID的前缀 |

### 返回

`string`

### 示例

```js
    
import { uniqueId } from 'spark-utils';

uniqueId('abc') // 'abc+从1开始递增'
uniqueId() // '从1开始递增'

```

## range

生成一个指定范围内的数组

### 参数

`range(start, end, [step])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| start | number | 是 | 开始值 |
| end | number | 是 | 结束值 |
| step | number | 否 | 步长 |

### 返回

`Array`

### 示例

```js
    
import { range } from 'spark-utils';

range(1, 5) // [1, 2, 3, 4, 5]
range(1, 5, 2) // [1, 3]

```

## toStringJSON

字符串转 JSON

### 参数

`toStringJSON(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | string | 是 | 需要转换的值 |

### 返回

`string`

### 示例

```js
    
import { toStringJSON } from 'spark-utils';

toStringJSON('{"a":1,"b":2}') // {a: 1, b: 2}
toStringJSON('{"a":1,"b":2,"c":{"d":3}}') // {a: 1, b: 2, c: {d: 3}}
toStringJSON('{"a":1,"b":2,"c":{"d":3,"e":[1,2,3]}}') // {a: 1, b: 2, c: {d: 3, e: [1, 2, 3]}}

```

## toJSONString

JSON 转字符串

### 参数

`toJSONString(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | * | 是 | 需要转换的值 |

### 返回

`string`

### 示例

```js
    
import { toJSONString } from 'spark-utils';

toJSONString({a: 1, b: 2}) // '{"a":1,"b":2}'
toJSONString({a: 1, b: 2, c: {d: 3}}) // '{"a":1,"b":2,"c":{"d":3}}'
toJSONString({a: 1, b: 2, c: {d: 3, e: [1,2,3]}}) // '{"a":1,"b":2,"c":{"d":3,"e":[1,2,3]}}'

```

## property

获取对象属性

### 参数

`property(path)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| path | string | 是 | 属性路径 |

### 返回

`function`

### 示例

```js
    
import { property } from 'spark-utils';

let getName = property('age')
getName({name: '鸡你太美', age: 25, height: 180}) // '25'
getName({height: 176}) // undefined

```
