# WebStorage工具

## createWebStorage

初始化一个storage对象

### 参数

`createWebStorage(name, options)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| name | string | 是 | storage名称 | - |
| options | object | 否 | 配置项 | - |

### options

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| isLocal | boolean | 否 | true: 使用localStorage进行存储，false: 使用sessionStorage进行存储 | - |
| failureTime | string | 否 | 失效时间 | - |

### 返回值

`WebStorage`

### 示例

```js
import { createWebStorage } from 'spark-utils';

const storage = createWebStorage('index_theme', { isLocal: true, }) // 创建一个名为'index_theme'的localStorage,返回值为这个storage对象
console.log("🚀 ~ storage:", storage)
注意： 除createWebStorage用来构造一个storage对象外，webStorage的其他对象均是storage对象的实例方法，不能使用webStorage来调用!

```

## getStorage

快速获取指定storage内的指定key的值

### 参数

`getStorage(storageName, storageKey, isLocal)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| storageName | string | 是 | storage名称 | - |
| storageKey | string | 是 | storageKey | - |
| isLocal | boolean | 否 | true: 使用localStorage进行存储，false: 使用sessionStorage进行存储 | - |

### 返回值

`any`

### 示例

```js

import { createWebStorage, getStorage } from 'spark-utils';

const value = getStorage('index_theme','name', true) // 坤坤

```

## set

设置一个值

### 参数

`set(key,value)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| key | string | 是 | 存储的key | - |
| value | any | 是 | 存储的值 | - |

### 返回值

`void`

### 示例

```js

import { createWebStorage } from 'spark-utils';

const storage = createWebStorage('index_theme', { isLocal: true, })
storage.set('name', '坤坤')

```

## get

获取一个值

### 参数

`get(key)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| key | string | 是 | 存储的key | - |

### 返回值

`any`

### 示例

```js

import { createWebStorage } from 'spark-utils';

const storage = createWebStorage('index_theme', { isLocal: true, })
storage.get('name') // 坤坤

```

## getAll

获取所有值

### 参数

`getAll()`

### 返回值

`object`

### 示例

```js

import { createWebStorage } from 'spark-utils';

const storage = createWebStorage('index_theme', { isLocal: true, })
storage.getAll() // {name: '坤坤'}

```

## remove

删除一个值

### 参数

`remove(key)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| key | string | 是 | 存储的key | - |

### 返回值

`void`

### 示例

```js
    
import { createWebStorage } from 'spark-utils';

const storage = createWebStorage('index_theme', { isLocal: true, })
storage.remove('name')

```

## removeData

完全移除当前storage对象

### 参数

`removeData()`

### 返回值

`void`

### 示例

```js

import { createWebStorage } from 'spark-utils';

const storage = createWebStorage('index_theme', { isLocal: true, })
storage.removeData()

```

## cleanData

重置当前storage

### 参数

`cleanData()`

### 返回值

`void`

### 示例

```js

import { createWebStorage } from 'spark-utils';

const storage = createWebStorage('index_theme', { isLocal: true, })
storage.cleanData()
注意: 这个方法会移除storage的所有值

```

## cleanFailureData

移除超时的所有值

### 参数

`cleanFailureData()`

### 返回值

`void`

### 示例

```js

import { createWebStorage } from 'spark-utils';

const storage = createWebStorage('index_theme', { isLocal: true, })
storage.cleanFailureData()

```
