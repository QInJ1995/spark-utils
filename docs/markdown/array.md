# 数组

## some

数组中的值中的每一项运行给定函数,如果函数对任一项返回 true,则返回 true,否则返回 false

### 参数

`some(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 遍历数组 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`boolean`

### 示例

```js
import { some } from 'spark-utils';

some([{value: 123}, {value: 456}, {value: 789}], item => item.value === 555) // false
some([{value: 123}, {value: 456}, {value: 789}], item => item.value === 123) // true

```

## every

数组中的值中的每一项运行给定函数,如果函数对每一项都返回 true,则返回 true,否则返回 false

### 参数

`every(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 遍历数组 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`boolean`

### 示例

```js
import { every } from 'spark-utils';

every([{value: 123}, {value: 456}, {value: 789}], item => item.value === 123) // false
every([{value: 123}, {value: 123}, {value: 123}], item => item.value === 123) // true

```

## filter

过滤数组中的值,返回满足条件的值

### 参数

`filter(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 遍历数组 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`array`

### 示例

```js
    
import { filter } from 'spark-utils';

filter([{value: 123}, {value: 456}, {value: 789}], item => item.value === 123) // [{value: 123}]
filter([{value: 123}, {value: 456}, {value: 789}], item => item.value > 123) // [{value: 456}, {value: 789}]

```

## find

查找数组中的值,返回满足条件的第一个值

### 参数

`find(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 遍历数组 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`object`

### 示例

```js
    
import { find } from 'spark-utils';

find([{value: 123}, {value: 456}, {value: 789}], item => item.value === 123) // {value: 123}
find([{value: 123}, {value: 456}, {value: 789}], item => item.value > 123) // {value: 456}

```

## findKey

查找数组中的值,返回满足条件的第一个值的 key

### 参数

`findKey(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 遍历数组 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`string`

### 示例

```js
    
import { findKey } from 'spark-utils';

findKey([{value: 123, key: 'a'}, {value: 456, key: 'b'}, {value: 789, key: 'c'}], item => item.value === 123) // 'a'
findKey([{value: 123, key: 'a'}, {value: 456, key: 'b'}, {value: 789, key: 'c'}], item => item.value > 123) // 'b'

```

## map

遍历数组中的值,返回映射后的值

### 参数

`map(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 遍历数组 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`array`

### 示例

```js
    
import { map } from 'spark-utils';

map([{value: 123}, {value: 456}, {value: 789}], item => item.value * 2) // [{value: 246}, {value: 912}, {value: 1568}]

```

## toArrayTree

将数组转换为树形结构

### 参数

`toArrayTree(value, options)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 遍历数组 |
| options | object | 否 | 配置项 |

`options`

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| key | 节点键值 | id |
| parentKey | 父节点键值 | parentId |
| children | 数据存放属性 | children |
| sortKey | 对树节点进行排序属性 |  |
| reverse | sortKey不为空是有效，默认升序 | false |
| data | 数据存放属性 | null |
| strict | 是否严格模式，会去掉父子关联不存在数据，当子节点为空时将没有 children 属性 | false |

### 返回

`array`

### 示例

```js

import { toArrayTree } from 'spark-utils';

// 默认树结构
let list1 = [
    {id: 1, name: '111'},
    {id: 2, parentId: 1, name: '222'},
    {id: 3, name: '333'},
    {id: 4, parentId: 2, name: '444'}
]
toArrayTree(list1)
/*
[
    {
    "id":1,
    "name":"111",
    "children":[
        {
        "id":2,
        "parentId":1,
        "name":"222",
        "children":[
            {
            "id":4,
            "parentId":2,
            "name":"444",
            "children":[]
            }
        ]
        }
    ]
    },
    {
    "id":3,
    "name":"333",
    "children":[]
    }
]
*/

// 返回带排序的树结构
let list2 = [
    {id: 1, name: '111', seq: 5},
    {id: 2, parentId: 1, name: '222', seq: 3},
    {id: 3, name: '333', seq: 6},
    {id: 4, parentId: 2, name: '444', seq: 2},
    {id: 5, parentId: 1, name: '555', seq: 1}
]
toArrayTree(list2, {sortKey: 'seq'})
/*
[
    {
    "id":1,
    "name":"111",
    "seq":5,
    "children":[
        {
        "id":5,
        "parentId":1,
        "name":"555",
        "seq":1,
        "children":[]
        },
        {
        "id":2,
        "parentId":1,
        "name":"222",
        "seq":3,
        "children":[
            {
            "id":4,
            "parentId":2
            ,"name":"444",
            "seq":2,
            "children":[]
            }
        ]
        }
    ]
    },
    {
    "id":3,
    "name":"333",
    "seq":6,
    "children":[]
    }
]
*/

// 自定义数据存放属性
let list3 = [
    {id: 1, name: '111'},
    {id: 2, parentId: 1, name: '222'},
    {id: 3, name: '333'},
    {id: 4, parentId: 2, name: '444'},
    {id: 5, parentId: 22, name: '555'}
]
toArrayTree(list3, {data: 'data'})
/*
[
    {
    "data":{"id":1,"name":"111"},
    "id":1,
    "children":[
        {
        "data":{"id":2,"parentId":1,"name":"222"},
        "id":2,
        "parentId":1,
        "children":[
            {
            "data":{"id":4,"parentId":2,"name":"444"},
            "id":4,
            "parentId":2,
            "children":[]
            }
        ]
        }
    ]
    },
    {
    "data":{"id":3,"name":"333"},
    "id":3,
    "children":[]
    },
    {
    "data":{"id":5,"parentId":22,"name":"555"},
    "id":5,
    "parentId":22,
    "children":[]
    }
]
*/

// 如果设置为严格模式，（非父子关联及冗余)的数据会被忽略
let list4 = [
    {id: 1, name: '111'},
    {id: 2, parentId: 1, name: '222'},
    {id: 3, name: '333'},
    {id: 4, parentId: 2, name: '444'},
    {id: 5, parentId: 22, name: '555'}
]
toArrayTree(list4, {strict: true, parentKey: 'parentId', key: 'id', children: 'children', data: 'data'})
/*
[
    {
    "data":{"id":1,"name":"111"},
    "id":1,
    "children":[
        {
        "data":{"id":2,"parentId":1,"name":"222"},
        "id":2,
        "parentId":1,
        "children":[
            {
            "data":{"id":4,"parentId":2,"name":"444"},
            "id":4,
            "parentId":2,
            "children":[]
            }
        ]
        }
    ]
    },
    {
    "data":{"id":3,"name":"333"},
    "id":3,
    "children":[]
    }
]
*/

```

## toTreeArray

将树形结构转换为数组

### 参数

`toTreeArray(tree, options)`
| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tree | array | 是 | 树形结构 |
| options | object | 否 | 配置项 |

`options`

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| data | 数据存放属性 |  |
| clear | 同时移除子节点属性 | false |
| children | 子节点属性 | children |

### 返回

`array`

### 示例

```js

import { toTreeArray } from 'spark-utils';

let list1 = [
    {
    "id":1,
    "name":"111",
    "children":[
        {
        "id":2,
        "parentId":1,
        "name":"222",
        "children":[
            {
            "id":4,
            "parentId":2,
            "name":"444",
            "children":[]
            }
        ]
        }
    ]
    },
    {
    "id":3,
    "name":"333",
    "children":[]
    }
]
toTreeArray(list1)
/*
[
    {id: 1, name: '111'},
    {id: 2, parentId: 1, name: '222'},
    {id: 4, parentId: 2, name: '444'}
    {id: 3, name: '333'}
]
*/

let list2 = [
    {
    "data":{"id":1,"name":"111"},
    "id":1,
    "children":[
        {
        "data":{"id":2,"parentId":1,"name":"222"},
        "id":2,
        "parentId":1,
        "children":[
            {
            "data":{"id":4,"parentId":2,"name":"444"},
            "id":4,
            "parentId":2,
            "children":[]
            }
        ]
        }
    ]
    },
    {
    "data":{"id":3,"name":"333"},
    "id":3,
    "children":[]
    },
    {
    "data":{"id":5,"parentId":22,"name":"555"},
    "id":5,
    "parentId":22,
    "children":[]
    }
]
toTreeArray(list2, {data: 'data'})
/*
[
    {id: 1, name: '111'},
    {id: 2, parentId: 1, name: '222'},
    {id: 4, parentId: 2, name: '444'},
    {id: 3, name: '333'},
    {id: 5, parentId: 22, name: '555'}
]
*/

```

## findTree

查找树形结构

### 参数

`findTree(tree, iterator, [options], [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tree | array | 是 | 树形结构 |
| iterator | Function | 是 | 迭代器 |
| options | object | 否 | 配置项 |
| context | object | 否 | 上下文 |

`options`

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| children | 子节点属性 | children |

### 返回

`object`

### 示例

```js

import { findTree } from 'spark-utils';

var tree1 = [
    { id: 1 },
    {
    id: 2,
    children: [
        { id: 20 }
    ]
    },
    {
    id: 3,
    children: [
        { id: 30 }
    ]
    }
]
findTree(tree1, item => item.id === 20) // { item: {id: 20}, ... }

var tree2 = [
    { id: 1 },
    {
    id: 2,
    childs: [
        { id: 20 }
    ]
    },
    {
    id: 3,
    childs: [
        { id: 30 }
    ]
    }
]
findTree(tree2, item => item.id === 20, { children: 'childs' }) // { item: {id: 20}, ... }

```

## eachTree

遍历树形结构

### 参数

`eachTree(tree, iterator, [options], [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tree | array | 是 | 树形结构 |
| iterator | Function | 是 | 迭代器 |
| options | object | 否 | 配置项 |
| context | object | 否 | 上下文 |

`options`

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| children | 子节点属性 | children |

### 返回

`void`

### 示例

```js

import { eachTree } from 'spark-utils';

var tree1 = [
    { id: 1 },
    {
    id: 2,
    children: [
        { id: 20 }
    ]
    },
    {
    id: 3,
    children: [
        { id: 30 }
    ]
    }
]
eachTree(tree1, item => {
    // ...
})

var tree2 = [
    { id: 1 },
    {
    id: 2,
    childs: [
        { id: 20 }
    ]
    },
    {
    id: 3,
    childs: [
        { id: 30 }
    ]
    }
]
eachTree(tree2, item => {
    // ...
}, { children: 'childs' })

```

## mapTree

映射树形结构

### 参数

`mapTree(tree, iterator, [options], [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tree | array | 是 | 树形结构 |
| iterator | Function | 是 | 迭代器 |
| options | object | 否 | 配置项 |
| context | object | 否 | 上下文 |

`options`

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| children | 子节点属性 | children |
| mapChildren | 将子节点映射到指定的属性 |  |

### 返回

`array`

### 示例

```js

import { mapTree } from 'spark-utils';

var tree1 = [
    { id: 1 },
    {
    id: 2,
    children: [
        { id: 20 }
    ]
    }, {
    id: 3,
    children: [
        { id: 30 }
    ]
    }
]
mapTree(tree1, item => {
    return {
    id: item.id * 2
    }
})
// [
//   { id: 2 },
//   {
//     id: 4,
//     children: [
//       { id: 40 }
//     ]
//   }, {
//     id: 6,
//     children: [
//       { id: 60 }
//     ]
//   }
// ]

var tree2 = [
    { id: 1 },
    {
    id: 2,
    childs: [
        { id: 20 }
    ]
    },
    {
    id: 3,
    childs: [
        { id: 30 }
    ]
    }
]
mapTree(tree2, item => {
    return {
    id: item.id * 2
    }
}, {children: 'childs'})
// [
//   { id: 2 },
//   {
//     id: 4,
//     childs: [
//       { id: 40 }
//     ]
//   },
//   {
//     id: 6,
//     childs: [
//       { id: 60 }
//     ]
//   }
// ]

var tree3 = [
    { id: 1 },
    {
    id: 2,
    childs: [
        { id: 20 }
    ]
    },
    {
    id: 3,
    childs: [
        { id: 30 }
    ]
    }
]
mapTree(tree3, item => {
    return {
    id: item.id * 2
    }
}, { children: 'childs', mapChildren: 'list' })
// [
//   { id: 2 },
//   {
//     id: 4,
//     list: [
//       { id: 40 }
//     ]
//   },
//   {
//     id: 6,
//     list: [
//       { id: 60 }
//     ]
//   }
// ]

```

## filterTree

过滤树形结构

### 参数

`filterTree(tree, iterator, [options], [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tree | array | 是 | 树形结构 |
| iterator | Function | 是 | 迭代器 |
| options | object | 否 | 配置项 |
| context | object | 否 | 上下文 |

`options`

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| children | 子节点属性 | children |

### 返回

`array`

### 示例

```js

import { filterTree } from 'spark-utils';

var tree1 = [
    { id: 1 },
    {
    id: 2,
    children: [
        { id: 20 }
    ]
    },
    {
    id: 3,
    children: [
        { id: 30 }
    ]
    }
]
filterTree(tree1, item => item.id === 1)
// { id: 1 }

var tree2 = [
    { id: 1 },
    {
    id: 2,
    childs: [
        { id: 20 }
    ]
    },
    {
    id: 3,
    childs: [
        { id: 30 }
    ]
    }
]
filterTree(tree2, item => item.id >= 3, {children: 'childs'})
// [
//   {
//     id: 3,
//     childs: [
//       { id: 30 }
//     ]
//   }
// ]

```

## searchTree

搜索树形结构

### 参数

`searchTree(tree, iterator, [options], [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| tree | array | 是 | 树形结构 |
| iterator | Function | 是 | 迭代器 |
| options | object | 否 | 配置项 |
| context | object | 否 | 上下文 |

`options`

| 参数名 | 说明 | 默认值 |
| --- | --- | --- |
| children | 子节点属性 | children |
| mapChildren | 将子节点映射到指定的属性 |  |
| original | 是否源对象地址引用（谨慎！源数据将被破坏） | false |

### 返回

`object`

### 示例

```js

import { searchTree } from 'spark-utils';

var tree1 = [
    { id: 1 },
    {
    id: 2,
    children: [
        { id: 0 }
    ]
    },
    {
    id: 3,
    children: [
        {
        id: 30,
        children: [
            { id: 3001 }
        ]
        },
        { id: 31 }
    ]
    }
]
searchTree(tree1, item => item.id === 3)
// [
//   {
//     id: 3,
//     children: [
//       {
//         id: 30,
//         children: [
//           { id: 3001 }
//         ]
//       },
//       { id: 31 }
//     ]
//   }
// ]

var tree2 = [
    { id: 1 },
    {
    id: 2,
    childs: [
        { id: 0 }
    ]
    },
    {
    id: 3,
    childs: [
        {
        id: 30,
        childs: [
            { id: 3001 }
        ]
        },
        { id: 31 }
    ]
    }
]
searchTree(tree2, item => item.id === 30, { children: 'childs' })
// [
//   {
//     id: 3,
//     childs: [
//       {
//         id: 30,
//         childs: [
//           { id: 3001 }
//         ]
//       }
//     ]
//   }
// ]

var tree3 = [
    { id: 1 },
    {
    id: 2,
    childs: [
        { id: 0 }
    ]
    },
    {
    id: 3,
    childs: [
        {
        id: 30,
        childs: [
            { id: 3001 }
        ]
        },
        { id: 31 }
    ]
    }
]
searchTree(tree3, item => item.id === 30, { children: 'childs', mapChildren: 'list' })
// [
//   {
//     id: 3,
//     childs: [
//       {
//         id: 30,
//         childs: [
//           { id: 3001 }
//         ]
//       },
//       { id: 31 }
//     ]
//     list: [
//       {
//         id: 30,
//         list: [
//           { id: 3001 }
//         ]
//       }
//     ]
//   }
// ]

```

## arrayEach

数组迭代器(可迭代伪数组)

### 参数

`arrayEach(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 遍历数组 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`undefined`

### 示例

```js
    
import { arrayEach } from 'spark-utils';

arrayEach([{value: 123}, {value: 456}, {value: 789}], item => console.log(item.value))

```

## lastArrayEach

数组迭代器, 从最后开始迭代(可迭代伪数组)

### 参数

`lastArrayEach(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 遍历数组 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`undefined`

### 示例

```js
    
import { lastArrayEach } from 'spark-utils';

lastArrayEach([{value: 123}, {value: 456}, {value: 789}], item => console.log(item.value))

```

## slice

裁剪（数组或伪数组），从 start 位置开始到 end 结束，但不包括 end 本身的位置

### 参数

`slice(value, start, end)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 遍历数组 |
| start | number | 否 | 开始位置 |
| end | number | 否 | 结束位置 |

### 返回

`array`

### 示例

```js
    
import { slice } from 'spark-utils';

slice([{value: 123}, {value: 456}, {value: 789}], 1, 2) // [{value: 456}]

```

## indexOf

查找数组中的值,返回满足条件的第一个值的索引

### 参数

`indexOf(value, targetValue)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| targetValue | string/number | 是 | 目标值 |

### 返回

`number`

### 示例

```js
    
import { indexOf } from 'spark-utils';

indexOf([1, 2, 3, 4, 5], 8) // 0
indexOf([1, 2, 3, 4, 5], 2) // 1

```

## arrayIndexOf

查找数组中的值,返回满足条件的第一个值的索引(比indexOf速度快)

### 参数

`arrayIndexOf(value, targetValue)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| targetValue | string/number | 是 | 目标值 |

### 返回

`number`

### 示例

```js
    
import { arrayIndexOf } from 'spark-utils';

arrayIndexOf([1, 2, 3, 4, 5], 3) // 2

```

## findIndexOf

查找数组中的值,返回满足条件的第一个值的索引

### 参数

`findIndexOf(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`number`

### 示例

```js
    
import { findIndexOf } from 'spark-utils';

findIndexOf([{value: 123}, {value: 456}, {value: 789}], item => item.value === 456) // 1
findIndexOf([{value: 123}, {value: 456}, {value: 789}], item => item.value === 1231) // -1

```

## lastIndexOf

查找数组中的值,返回满足条件的第一个值的索引(从后往前查找)

### 参数

`lastIndexOf(value, targetValue)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| targetValue | string/number | 是 | 目标值 |

### 返回

`number`

### 示例

```js
    
import { lastIndexOf } from 'spark-utils';

lastIndexOf([1, 2, 3, 4, 5], 8) // 0
lastIndexOf([1, 2, 3, 4, 5], 2) // 1

```

## arrayLastIndexOf

查找数组中的值,返回满足条件的第一个值的索引(比lastIndexOf速度快)

### 参数

`arrayLastIndexOf(value, targetValue)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| targetValue | string/number | 是 | 目标值 |

### 返回

`number`

### 示例

```js
    
import { arrayLastIndexOf } from 'spark-utils';

arrayLastIndexOf([1, 2, 3, 4, 5], 3) // 2

```

## findLastIndexOf

查找数组中的值,返回满足条件的第一个值的索引(从后往前查找)

### 参数

`findLastIndexOf(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| iterator | Function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`number`

### 示例

```js
    
import { findLastIndexOf } from 'spark-utils';

findLastIndexOf([{value: 123}, {value: 456}, {value: 789}], item => item.value === 456) // 1
findLastIndexOf([{value: 123}, {value: 456}, {value: 789}], item => item.value === 1231) // -1

```

## includes

判断数组中是否包含某个值

### 参数

`includes(value, targetValue)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| targetValue | string/number | 是 | 目标值 |

### 返回

`boolean`

### 示例

```js
    
import { includes } from 'spark-utils';

includes([1, 2, 3, 4, 5], 8) // false
includes([1, 2, 3, 4, 5], 2) // true

```

## includeArrays

判断数组是否包含另一数组

### 参数

`includeArrays(array1, array2)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| array1 | array | 是 | 数组 |
| array2 | array | 是 | 目标数组 |

### 返回

`boolean`

### 示例

```js
    
import { includeArrays } from 'spark-utils';

includeArrays([1, 2, 3], [1, 2]) // true
includeArrays([1, 2, 3], []) // true
includeArrays([1, 2, 3], [3, 4, 5]) // false

```

## remove

删除数组中的值

### 参数

`remove(value, iterator)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| iterator | * | 是 | 目标值 |

### 返回

`array`

### 示例

```js
    
import { remove } from 'spark-utils';

let list1 = [11, 22, 33, 44]
remove(list1, 2) // list1 = [11, 22, 44]
let list2 = [11, 22, 33, 44]
remove(list2, item => item === 22) // list2 = [11, 33, 44]

```

## orderBy | sortBy

对数组进行排序

### 参数

`orderBy(value, config, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| config | * | 是 | 配置 |
| context | object | 否 | 上下文 |

### 返回

`array`

### 示例

```js
    
import { orderBy } from 'spark-utils';

// 数值排序
orderBy([11, 55, 99, 77, 11, 55, 22])
// [11, 11, 22, 55, 55, 77, 99]
// 字母排序
orderBy(['x', 'z', 'g', 'q', 'e', 'b', 'a', 'g', 'f', 'c', 'j'])
// ["a", "b", "c", "e", "f", "g", "g", "j", "q", "x", "z"]
// 中文排序
orderBy(['小', '何', '李', '林', '有', '好', '啊', '的', '出', '库', '徐'])
// ['啊', '出', '的', '好', '何', '库', '李', '林', '小', '徐', '有']
// 倒序
orderBy([11, 55, 99, 77, 11, 55, 22], { order: 'desc' })
// [99, 77, 55, 55, 22, 11, 11]
// 深层对象
orderBy([{ age: 27 }, { age: 26 }, { age: 28 }], 'age')
orderBy([{ age: 27 }, { age: 26 }, { age: 28 }], ['age', 'desc'])
// [{ age: 26 }, { age: 27 }, { age: 28 }]
// 多字段排序
orderBy([
    { name: 'x', age: 26 },
    { name: 'd', age: 27 },
    { name: 'z', age: 26 },
    { name: 'z', age: 24 },
    { name: 'z', age: 25 }
], [['age', 'asc'], ['name', 'desc']])
/*
[{ name: 'z', age: 24 },
{ name: 'z', age: 25 },
{ name: 'x', age: 26 },
{ name: 'z', age: 26 },
{ name: 'd', age: 27 }]
*/
// 自定义组合排序
orderBy([
    { name: 'x', age: 26 },
    { name: 'd', age: 27 },
    { name: 'x', age: 26 },
    { name: 'z', age: 26 }
], [[item => item.name, 'asc'], [field: item => item.age, 'desc']])
/*
[{ name: 'd', age: 27 },
{ name: 'x', age: 26 },
{ name: 'x', age: 26 },
{ name: 'z', age: 26 }]
*/

```

## shuffle

随机打乱数组

### 参数

`shuffle(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |

### 返回

`array`

### 示例

```js
    
import { shuffle } from 'spark-utils';

shuffle([1, 2, 3, 4, 5]) // [4, 2, 1, 3, 5]

```

## sample

随机从数组中获取一个或多个元素

### 参数

`sample(value, [count])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| count | number | 否 | 数量 |

### 返回

`array`

### 示例

```js
    
import { sample } from 'spark-utils';

sample([1, 2, 3, 4, 5]) // [3]
sample([1, 2, 3, 4, 5], 2) // [1, 4]

```

## copyWithin

浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度。

### 参数

`copyWithin(value, target, start, [end])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| target | number | 是 | 目标位置 |
| start | number | 否 | 开始位置 |
| end | number | 否 | 结束位置 |

### 返回

`array`

### 示例

```js
    
import { copyWithin } from 'spark-utils';

copyWithin([1, 2, 3, 4, 5], 0, 3) // [4, 5, 3, 4, 5]
copyWithin([1, 2, 3, 4, 5], 0, 2, 4) // [3, 4, 3, 4, 5]

```

## sum

计算数组中所有元素的总和

### 参数

`sum(value, [iterator], [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| iterator | Function | 否 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`number`

### 示例

```js
    
import { sum } from 'spark-utils';

sum([1, 2, 3, 4, 5]) // 15
sum([{value: 11}, {value: 22}, {value: 66}], 'value') // 99
sum([1, 2, 3, 4, 5], item => item * 2) // 30
sum({val1: 21, val2: 34, val3: 47}) // 102

```

## mean

计算数组中所有元素的平均值

### 参数

`mean(value, [iterator], [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| iterator | Function | 否 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`number`

### 示例

```js

import { mean } from 'spark-utils';

mean([1, 2, 3, 4, 5]) // 3
mean([{value: 11}, {value: 22}, {value: 66}], 'value') // 33
mean([1, 2, 3, 4, 5], item => item * 2) // 6
mean({val1: 21, val2: 34, val3: 47}) // 34

```

## toArray

将对象或者伪数组转为新数组

### 参数

`toArray(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | object | 是 | 类数组或者对象 |

### 返回

`array`

### 示例

```js

import { toArray } from 'spark-utils';

toArray({0: 'a', 1: 'b', 2: 'c'}) // ['a', 'b', 'c']
toArray('abc') // ['a', 'b', 'c']
```

## reduce

将数组中的元素通过函数进行累积

### 参数

`reduce(value, iterator, [initialValue])`
| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| iterator | Function | 是 | 迭代器 |
| initialValue | any | 否 | 初始值 |

### 返回

`any`

### 示例

```js

import { reduce } from 'spark-utils';

reduce([1, 2, 3, 4, 5], (acc, item) => acc + item) // 15
reduce([1, 2, 3, 4, 5], (acc, item) => acc + item, 10) // 25

```

## zip

将多个数组按照索引进行合并

### 参数

`zip(...value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |

### 返回

`array`

### 示例

```js

import { zip } from 'spark-utils';

zip([1, 2, 3], ['a', 'b', 'c'], [true, false, true]) // [[1, 'a', true], [2, 'b', false], [3, 'c', true]]

```

## unzip

将多个数组按照索引进行拆分

### 参数

`unzip(value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |

### 返回

`array`

### 示例

```js

import { unzip } from 'spark-utils';

unzip([[1, 'a', true], [2, 'b', false], [3, 'c', true]]) // [[1, 2, 3], ['a', 'b', 'c'], [true, false, true]]

```

## zipObject

将多个数组按照索引进行合并，并生成一个对象

### 参数

`zipObject(props, values)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| props | array | 是 | 属性数组 |
| values | array | 是 | 值数组 |

### 返回

`object`

### 示例

```js

import { zipObject } from 'spark-utils';

zipObject(['a', 'b', 'c'], [1, 2, 3]) // { a: 1, b: 2, c: 3 }

```

## arrayDistinct

数组去重

### 参数

`arrayDistinct(value, [property])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| property | string | 否 | 属性名(去重对象必填) |

### 返回

`array`

### 示例

```js

import { arrayDistinct } from 'spark-utils';

arrayDistinct([1, 2, 3, 3, 4, 5]) // [1, 2, 3, 4, 5]
arrayDistinct([{a: 1}, {b: 2}, {a: 1}], 'a') // [{a: 1}, {b: 2}]

```

## union

数组去重并合并

### 参数

`union(...values)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| values | array | 是 | 数组 |

### 返回

`array`

### 示例

```js

import { union } from 'spark-utils';

union([1, 2, 3], [3, 4, 5], [5, 6, 7]) // [1, 2, 3, 4, 5, 6, 7]

```

## flatten

将多维数组转换为一维数组

### 参数

`flatten(value, [deep])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| deep | boolean | 否 | 是否深度转换 |

### 返回

`array`

### 示例

```js

import { flatten } from 'spark-utils';

flatten([1, 2, [3, 4], [5, [6, 7]]]) // [1, 2, 3, 4, 5, 6, 7]
flatten([1, 2, [3, 4], [5, [6, 7]]], true) // [1, 2, 3, 4, 5, 6, 7]

```

## chunk

将数组分割成多个子数组，每个子数组包含`size`个元素

### 参数

`chunk(value, size)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| size | number | 是 | 子数组大小 |

### 返回

`array`

### 示例

```js

import { chunk } from 'spark-utils';

chunk([1, 2, 3, 4, 5, 6, 7], 3) // [[1, 2, 3], [4, 5, 6], [7]]

```

## pluck

从数组中取出指定属性

### 参数

`pluck(value, key)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| key | string | 是 | 属性名 |

### 返回

`array`

### 示例

```js

import { pluck } from 'spark-utils';

pluck([{a: 1}, {b: 2}], 'a') // [1]

```

## invoke

调用数组中每个元素上的指定方法

### 参数

`invoke(value, methodName, ...args)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| methodName | string | 是 | 方法名 |
| args | any | 否 | 参数 |

### 返回

`array`

### 示例

```js

import { invoke } from 'spark-utils';

invoke([[3, 1, 6, 7], [3, 2, 1, 8]], 'sort') // [[1, 3, 6, 7], [1, 2, 3, 8]]
invoke(['123', '456'], 'split') // [['123'], ['456']]
invoke([123, 456], String.prototype.split, '') // [['1', '2', '3'], ['4', '5', '6']]
invoke([{a: {b: [2, 0, 1]}}, {a: {b: [2, 1]}}, {a: {b: [4, 8, 1]}}], ['a', 'b', 'sort']) // [[0, 1, 2], [1, 2], [1, 4, 8]]

```

## groupBy

将数组分组

### 参数

`groupBy(value, iterator, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| iterator | function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`object`

### 示例

```js

import { groupBy } from 'spark-utils';

groupBy([1.3, 2.1, 2.4], Math.floor) // { '1': [1.3], '2': [2.1, 2.4] }
groupBy(['one', 'two', 'three'], 'length') // { '3': ['one', 'two'], '5': ['three'] }
groupBy([{name: 'zs', age: 22},{name: 'ls', age: 33}], 'name') // { 'zs': [{name: 'zs', age: 22}], 'ls': [{name: 'ls', age: 33}] }
groupBy([{name: 'Alice', age: 20}, {name: 'Bob', age: 21}, {name: 'Charlie', age: 22}], item => item.age) // { '20': [{name: 'Alice', age: 20}], '21': [{name: 'Bob', age: 21}], '22': [{name: 'Charlie', age: 22}] }

```

## countBy

统计数组中每个元素出现的次数

### 参数

`countBy(value, iterator, [context])`
| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| value | array | 是 | 数组 |
| iterator | function | 是 | 迭代器 |
| context | object | 否 | 上下文 |

### 返回

`object`

### 示例

```js

import { countBy } from 'spark-utils';

countBy([{cs: 'a'}, {cs: 'b'}], 'cs') // {a: 1, b: 1}
countBy([{cs: 'a'}, {cs: 'a'}, {cs: 'b'}], 'cs') // {a: 2, b: 1}

```
