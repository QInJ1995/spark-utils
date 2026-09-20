# 数组

数组与集合工具。全部从主入口具名导入。

::: tip 2.0 变更
`slice` / `indexOf` / `arrayIndexOf` / `lastIndexOf` / `arrayLastIndexOf` / `includes` / `copyWithin` / `invoke` 已删除：原生镜像请用 `Array.prototype` 同名方法，查找请用 `findIndexOf` / `findLastIndexOf`。
:::

## 检索与断言

### findIndexOf / findLastIndexOf

返回第一个 / 最后一个匹配项的索引（对象场景返回键名），未命中返回 `-1`。也支持直接传值匹配。

`findIndexOf(obj, iterate)` / `findLastIndexOf(obj, iterate)`

```ts
import { findIndexOf, findLastIndexOf } from 'spark-utils'

findIndexOf([11, 22, 33, 22], 22)                     // 1
findIndexOf([11, 22, 33], item => item > 20)          // 1
findLastIndexOf([11, 22, 33, 22], 22)                 // 3
findIndexOf({ a: 11, b: 22 }, item => item === 22)    // 'b'
```

::: tip 2.0 变更
合并自旧 `indexOf` / `arrayIndexOf` / `lastIndexOf` / `arrayLastIndexOf` 四个方法。
:::

### find / findKey

`find(obj, iterate)` 返回第一个匹配项的**值**；`findKey` 返回第一个匹配项的**键**。

```ts
import { find, findKey } from 'spark-utils'

find([{ a: 1 }, { a: 2 }], item => item.a === 2)   // { a: 2 }
findKey({ a: 11, b: 22 }, item => item > 20)       // 'b'
```

### some / every

`some(obj, iterate)` 是否存在命中项；`every` 是否全部命中。

```ts
import { some, every } from 'spark-utils'

some([1, 2, 3], item => item > 2)    // true
every([1, 2, 3], item => item > 0)   // true
```

### includeArrays

数组1 是否包含数组2 的全部项（无序包含判定）。

`includeArrays(array1, array2): boolean`

```ts
import { includeArrays } from 'spark-utils'

includeArrays([11, 22, 33], [11, 33])  // true
includeArrays([11, 22], [33])          // false
```

## 变换与集合

### map / filter / reduce

经典三件套，回调签名 `(item, index/key, obj)`。

```ts
import { map, filter, reduce } from 'spark-utils'

map([1, 2, 3], item => item * 2)             // [2, 4, 6]
filter([1, 2, 3, 4], item => item > 2)       // [3, 4]
reduce([1, 2, 3], (prev, item) => prev + item, 0)  // 6
```

### arrayEach / lastArrayEach

数组迭代器（仅遍历数组；`lastArrayEach` 倒序）。

```ts
import { arrayEach, lastArrayEach } from 'spark-utils'

arrayEach([1, 2, 3], (item, index) => console.log(index, item))
lastArrayEach([1, 2, 3], (item, index) => console.log(index, item))
```

### remove

移除数组/对象中匹配的项（原地变更），返回被移除项组成的数组（数组场景倒序收集）。

`remove(obj, iterate)`

```ts
import { remove } from 'spark-utils'

remove([11, 22, 33, 44], item => item > 22)  // [44, 33]，原数组变为 [11, 22]
```

### flatten

扁平化数组（默认拍平一层）。

`flatten(array, deep?)`

```ts
import { flatten } from 'spark-utils'

flatten([1, [2, 3], [4, [5]]])        // [1, 2, 3, 4, [5]]
flatten([1, [2, [3]]], true)          // [1, 2, 3]（全拍平）
```

### chunk

按大小切分数组。

`chunk(array, size)`

```ts
import { chunk } from 'spark-utils'

chunk([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]
```

### uniq / union / arrayDistinct

`uniq` 去重；`union` 合并多个数组后去重；`arrayDistinct(array, property)` 按属性值去重（保留首个）。

```ts
import { uniq, union, arrayDistinct } from 'spark-utils'

uniq([11, 22, 22, 33])                       // [11, 22, 33]
union([11, 22], [22, 33])                    // [11, 22, 33]
arrayDistinct(
  [{ id: 1, n: 'a' }, { id: 1, n: 'b' }, { id: 2, n: 'c' }],
  'id',
)  // [{ id: 1, n: 'a' }, { id: 2, n: 'c' }]
```

### zip / unzip / zipObject

数组打包 / 解包 / 键值对打包。

```ts
import { zip, unzip, zipObject } from 'spark-utils'

zip(['a', 'b'], [1, 2], [true, false])  // [['a', 1, true], ['b', 2, false]]
unzip([['a', 1, true], ['b', 2, false]])// [['a', 'b'], [1, 2], [true, false]]
zipObject(['a', 'b'], [1, 2])           // { a: 1, b: 2 }
```

### pluck

提取数组对象中某属性值组成新数组。

`pluck(array, key)`

```ts
import { pluck } from 'spark-utils'

pluck([{ a: 1 }, { a: 2 }], 'a')  // [1, 2]
```

### groupBy / countBy

按回调结果分组 / 计数。

```ts
import { groupBy, countBy } from 'spark-utils'

groupBy([1, 2, 3, 4], item => item % 2 === 0 ? 'even' : 'odd')
// { odd: [1, 3], even: [2, 4] }
countBy([1, 2, 3, 4], item => item % 2 === 0 ? 'even' : 'odd')
// { odd: 2, even: 2 }
```

### toArray

转为数组（字符串按字符拆分，可迭代对象展开）。

`toArray(value)`

```ts
import { toArray } from 'spark-utils'

toArray('abc')  // ['a', 'b', 'c']
toArray(25)     // [25]
```

## 排序与随机

### orderBy / sortBy

多字段排序；`sortBy` 为 `orderBy` 的别名（同签名）。

`orderBy(arr, fieldConfs?, context?)`——`fieldConfs` 支持「取值函数 / 属性名字符串 / `[field, order]` 元组 / `{ field, order }` 对象」，单条或数组皆可，`order` 缺省 `'asc'`；第三参 `context` 是回调的 this 绑定（**不是**排序方向）。

```ts
import { orderBy, sortBy } from 'spark-utils'

orderBy(list, [['age', 'asc'], ['score', 'desc']])
orderBy(list, ['age', ['score', 'desc']])  // 混合写法
sortBy([{ a: 3 }, { a: 1 }], 'a')          // [{ a: 1 }, { a: 3 }]
```

### shuffle / sample

乱序 / 随机取 n 项（均返回新数组）。

```ts
import { shuffle, sample } from 'spark-utils'

shuffle([1, 2, 3, 4, 5])
sample([1, 2, 3, 4, 5], 2)  // 随机 2 项
```

## 统计

### sum / mean

求和 / 平均值。

```ts
import { sum, mean } from 'spark-utils'

sum([1, 2, 3])   // 6
mean([1, 2, 3])  // 2
```

## 树结构

配置项默认 `{ parentKey: 'parentId', key: 'id', children: 'children' }`，可经各方法 options 覆盖。TS 下回调的 `item` / `items` / `parent` / `nodes` 与返回结果均按节点类型自动推断（`mapTree` 的映射结果类型从回调返回值推断）。

### toArrayTree / toTreeArray

扁平列表 ↔ 树结构互转。

```ts
import { toArrayTree, toTreeArray } from 'spark-utils'

const list = [
  { id: 1, parentId: null },
  { id: 2, parentId: 1 },
]
toArrayTree(list)  // [{ id: 1, parentId: null, children: [{ id: 2, parentId: 1 }] }]
toTreeArray(toArrayTree(list))  // 还原为扁平列表
```

### findTree / eachTree / mapTree / filterTree / searchTree

树结构的查找 / 遍历 / 映射 / 过滤 / 检索（`findTree` 命中时可通过回调接收 `item` 与 `index` 链）。

```ts
import { eachTree, filterTree, searchTree } from 'spark-utils'

eachTree(tree, (item, index, items, path, parent) => console.log(item.id))
filterTree(tree, item => item.status === 1, { children: 'children' })
searchTree(tree, item => item.name.includes('spark'))
```
