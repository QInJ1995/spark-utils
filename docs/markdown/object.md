# 对象

## has

判断对象是否有属性

### 参数

`has(obj, path)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | object | 是 | 对象 |
| path | string | 是 | 属性路径 |

### 返回

`boolean`

### 示例

```js
    
import { has } from 'spark-utils';

has({a: {b: 11, c: 22, d: [33, 44]}}, 'a.b') // true
has({a: {b: 11, c: 22, d: [33, 44]}}, 'a.e') // false
has({a: {b: 11, c: 22, d: [33, 44]}}, 'a.d[0]') // true
has({a: {b: 11, c: 22, d: [33, {f: 66}]}}, 'a.d[1].f') // true
has({a: {b: 11, c: 22, d: [33, 44]}}, ['a', 'd[1]']) // true
has({a: {b: 11, c: 22, d: [33, 44]}}, ['a', 'd[3]']) // false

```

## get

获取对象属性 如果值为 undefined，则返回默认值

### 参数

`get(obj, path, defaultValue)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | object | 是 | 对象 |
| path | string | 是 | 属性路径 |
| defaultValue | any | 否 | 默认值 |

### 返回

`any`

### 示例

```js

import { get } from 'spark-utils';

get({a: {b: 11, c: 22, d: [33, 44]}}, 'a.b') // 11
get({a: {b: 11, c: 22, d: [33, 44]}}, 'a.e', 'default') // 'default'
get({a: {b: 11, c: 22, d: [33, 44]}}, 'a.d[0]') // 33
get({a: {b: 11, c: 22, d: [33, {f: 66}]}}, 'a.d[1].f') // 66
get({a: {b: 11, c: 22, d: [33, 44]}}, ['a', 'c']) // 22

```

## set

设置对象属性 如果属性不存在则创建它
### 参数

`set(obj, path, value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | object | 是 | 对象 |
| path | string | 是 | 属性路径 |
| value | any | 是 | 属性值 |

### 返回

`object`

### 示例

```js

import { set } from 'spark-utils';

set({}, 'a.d[0]', 33) // {a: {d: [33]}}
set({a: {}}, 'a.d[0].f.h', 44) // {a: {d: [{f: {h: 44}}]}}
set({}, ['a', 'c'], 22) // {a: {c: 22}}
set({}, ['a', 'd[0]', 'f', 'h'], 44) // {a: {d: [{f: {h: 44}}]}}

```

## clear

清空对象属性 defs如果不传（清空所有属性）、如果传对象（清空并继承)、如果传值(给所有赋值)

### 参数

`clear(obj, [defs], [assigns])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | object | 是 | 对象 |
| defs | object | 否 | 默认值 |
| assigns | any | 否 | 赋值 |

### 返回

`object`

### 示例

```js

import { clear } from 'spark-utils';

let a = [11, 22, 33, 33]
clear(a) // []
clear(a, undefined) // [undefined, undefined, undefined, undefined]
clear(a, null) // [null, null, null, null]
let b = {b1: 11, b2: 22}
clear(b) // {}
clear(b, undefined) // {b1: undefined, b2: undefined}
clear(b, null) // {b1: null, b2: null}

```

## assign

将一个或多个源对象复制到目标对象中

### 参数

`assign(target, ...sources)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| target | object | 是 | 目标对象 |
| sources | object | 否 | 源对象 |

### 返回

`object`

### 示例

```js

import { assign } from 'spark-utils';

const obj1 = {a: 0, b: {b1: 11}}
const obj2 = assign(obj1, {a: 11}, {c: 33})
// {a: 11, b: {b1: 11}, c: 33}

const obj3 = {a: 0, b: {b1: 11}}
const obj4 = assign(obj1, {a: 11, b: {b2: 22}})
// {a: 11, b: {b2: 22}}

```

## merge

将一个或多个源对象合并到目标对象中，和 assign 的区别是会将对象或数组类型递归合并

### 参数

`merge(target, ...sources)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| target | object | 是 | 目标对象 |
| sources | object | 否 | 源对象 |

### 返回

`object`

### 示例

```js

import { merge } from 'spark-utils';

const obj1 = [{a: 11}, {b: 22}]
const obj2 = merge(obj1, [{c: 33}, {d: 44}])
// [{a: 11, c: 33}, {b: 22, d: 44}]

const obj3 = {a: 0, b: {b1: 11}, c: {c1: {d: 44}}}
const obj4 = merge(obj1, {a: 11, b: {b2: 22}, c: {f1: 55}})
// {a: 11, b: {b1: 11, b2: 22}, c: {c1: {d: 44}, f1: 55}}

```

## clone

浅拷贝/深拷贝，和 assign 的区别是支持对象的递归克隆

### 参数

`clone(target, deep = false)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| target | object | 是 | 目标对象 |
| deep | boolean | 否 | 是否深拷贝 |

### 返回

`object`

### 示例

```js

import { clone } from 'spark-utils';

let v1 = {a: 11, b: {b1: 22}}
let v2 = clone(v1)
v1.b === v2.b // true

let v3 = clone(v1, true)
v1.b === v3.b // false
                
```

## destructuring

将一个或者多个对象值解构到目标对象

### 参数

`destructuring(obj, ...target)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | object | 是 | 源对象 |
| target | object | 否 | 目标对象 |

### 返回

`object`

### 示例

```js

import { destructuring } from 'spark-utils';

destructuring({a: null}, {a: 11, b: 22, c: 33}) // {a: 11}
destructuring({a: 11, d: 44}, {a: 11, b: 22, c: 33}) // {a: 11, d: 44}
destructuring({a: 11, c: 33, d: 44}, {a: 11, b: 22, c: null, e: 55, f: 66}) // {a: 11, c: null, d: 44}

```

## objectEach

对象迭代器

### 参数

`objectEach(obj, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | object | 是 | 源对象 |
| iterator | function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`void`

### 示例

```js

import { objectEach } from 'spark-utils';

objectEach({a: 11, b: 22, c: 33}, (value, key) => {
    // 处理
    console.log(key, value)
}

```

## lastObjectEach

对象倒序迭代器

### 参数

`lastObjectEach(obj, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | object | 是 | 源对象 |
| iterator | function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`void`

### 示例

```js
import { lastObjectEach } from 'spark-utils';

lastObjectEach({a: 11, b: 22, c: 33}, (value, key) => {
    // 处理
    console.log(key, value)
}

```

## objectMap

对象映射

### 参数

`objectMap(obj, mapper, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | object | 是 | 源对象 |
| mapper | function | 是 | 映射器 |
| context | object | 否 | 上下文 |

### 返回

`object`

### 示例

```js
import { objectMap } from 'spark-utils';
const result = objectMap({
    a: 11,
    b: 22,
    c: 33
}
, (value, key) => {
    return value * 2;
}

// {a: 22, b: 44, c: 66}

```

## pick

根据 keys 过滤指定的属性值 或者 接收一个判断函数，返回一个新的对象

### 参数

`pick(obj, array)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | object | 是 | 源对象 |
| array | array | 是 | 属性数组 |

### 返回

`object`

### 示例

```js

import { pick } from 'spark-utils';

pick({name: 'test11', age: 25, height: 176}, 'name', 'height') // {name: 'test11', height: 176}
pick({name: 'test11', age: 25, height: 176}, ['name', 'age']) // {name: 'test11', age: 25}
pick({name: 'test11', age: 25, height: 176}, val => isNumber(val)) // {age: 25, height: 176}

```

## omit

根据 keys 排除指定的属性值 或者 接收一个判断函数，返回一个新的对象

### 参数

`omit(obj, array)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| obj | object | 是 | 源对象 |
| array | array | 是 | 属性数组 |

### 返回

`object`

### 示例

```js

import { omit } from 'spark-utils';

omit({name: 'test11', age: 25, height: 176}, 'name', 'height') // {age: 25}
omit({name: 'test11', age: 25, height: 176}, ['name', 'age']) // {height: 176}
omit({name: 'test11', age: 25, height: 176}, val => isNumber(val)) // {name: 'test11'}

```
