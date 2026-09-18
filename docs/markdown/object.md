# 对象

对象读写、合并与拾取工具。全部从主入口具名导入。

## has

对象是否含有指定键（含原型链，语义同 `in` 操作符的 hasOwnProp 变体）。

`has(obj, key)`

```ts
import { has } from 'spark-utils'

has({ a: 1 }, 'a')  // true
has({ a: 1 }, 'b')  // false
```

## get

按点路径安全取值（中途为空返回 `undefined`）。

`get(obj, path, defaultValue?)`

```ts
import { get } from 'spark-utils'

get({ a: { b: 2 } }, 'a.b')            // 2
get({ a: { b: 2 } }, 'a.c', 'none')    // 'none'
```

## set

按点路径设值（逐级创建中间对象，原地变更并返回 obj）。

`set(obj, path, value)`

```ts
import { set } from 'spark-utils'

const obj: Record<string, unknown> = {}
set(obj, 'a.b.c', 1)  // { a: { b: { c: 1 } } }
```

## clear

清空对象（删除全部自有键 / 数组长度归零；可传入 defs 与 assigns 定义清空后的形态）。

`clear(obj, defs?, assigns?)`

```ts
import { clear } from 'spark-utils'

clear({ a: 1, b: 2 })             // {}
clear({ a: 1, b: 2 }, undefined, { c: 3 })  // { c: 3 }
```

## assign

浅合并（同 `Object.assign`，忽略 null/undefined 源）。

```ts
import { assign } from 'spark-utils'

assign({ a: 1 }, { b: 2 }, null)  // { a: 1, b: 2 }
```

## merge

深合并（数组与对象递归合并）。

`merge(obj, ...sources)`

```ts
import { merge } from 'spark-utils'

merge({ a: { b: 1 } }, { a: { c: 2 } })  // { a: { b: 1, c: 2 } }
```

## clone

深拷贝（Date/RegExp/数组/对象等，无法识别的类型原样返回）。

`clone(obj)`

```ts
import { clone } from 'spark-utils'

const copied = clone({ a: { b: 1 } })
copied.a.b = 2
// 原对象不受影响
```

## destructuring

解构赋值：从 obj 中取出 keys（可含默认值映射），剩余部分作为 rest 返回。

`destructuring(obj, ...keys)` / `destructuring(obj, defs, keys)`

```ts
import { destructuring } from 'spark-utils'

const { rest } = destructuring({ a: 1, b: 2, c: 3 }, 'a', 'c')
// rest 为 { b: 2 }
```

## objectEach / lastObjectEach

对象迭代器（仅遍历自有可枚举属性；`lastObjectEach` 倒序）。

```ts
import { objectEach, lastObjectEach } from 'spark-utils'

objectEach({ a: 1, b: 2 }, (item, key) => console.log(key, item))
```

## objectMap

按回调返回值组成新对象（回调也可传属性名做浅拾取）。

`objectMap(obj, iterate?)`

```ts
import { objectMap } from 'spark-utils'

objectMap({ a: 1, b: 2 }, (item, key) => item * 2)  // { a: 2, b: 4 }
```

## pick / omit

拾取 / 排除指定键（支持数组或回调 `(value, key) => boolean`）。

`pick(obj, keys)` / `omit(obj, keys)`

```ts
import { pick, omit } from 'spark-utils'

pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])   // { a: 1, c: 3 }
omit({ a: 1, b: 2, c: 3 }, ['b'])        // { a: 1, c: 3 }
omit({ a: 1, b: 2 }, (val, key) => key === 'a')  // { b: 2 }
```
