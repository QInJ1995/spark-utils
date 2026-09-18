# WebStorage

localStorage / sessionStorage 命名空间封装，从 `spark-utils/browser` 子入口导入。

::: tip 2.0 变更
- 已弃用的 `init` 别名删除（用 `createWebStorage`）；
- 引入实例级缓存：读写不再每次 `JSON.parse` 整个原始串，高频读写性能大幅提升，跨实例 / 跨页写一致性自动保持；
- `getStorage` 创建失败时返回 `null`（旧版会继续调用并抛 `TypeError`）；
- 实例 `remove` 未初始化时返回 `false`（旧版返回 `undefined`，2.0 归一化为 boolean）；
- 存储日志改为经日志开关门控（旧版无条件 `console.log`）。
:::

## createWebStorage

创建一个 WebStorage 命名空间实例（对应底层 Storage 的一个键，键值为 JSON 序列化映射；`invalidTime !== -1` 时值包装时间戳惰性过期）。

`createWebStorage(name?, options?): WebStorageCreator | false`

| 参数 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| `name` | `string` | 存储键名 | `'SPARK$webstorage'` |
| `options.isLocal` | `boolean` | `true` 用 localStorage，`false` 用 sessionStorage | `false` |
| `options.invalidTime` | `number` | 失效时间（秒），`-1` 永不过期 | `-1` |

```ts
import { createWebStorage } from 'spark-utils/browser'

const store = createWebStorage('my-app', { isLocal: true, invalidTime: 3600 })

if (store !== false) {
  store.set('user', { id: 1 })   // 写入（3600 秒后过期）
  store.get('user')               // { id: 1 }（过期后返回 null 并顺带删除）
  store.remove('user')            // 删除指定 key
  store.getAllKeys()              // 全部 key
  store.removeData()              // 删除整个存储键
  store.cleanFailureData()        // 清理全部已过期键
}
```

实例方法一览（`WebStorageCreator`）：

| 方法 | 说明 |
| --- | --- |
| `get(key)` | 读取；不存在 / 已过期返回 `null` |
| `getAll()` | 整个映射；未初始化返回 `null` |
| `getAllKeys()` | 全部 key |
| `set(key, value)` | 写入 |
| `remove(key)` | 删除；未初始化返回 `false` |
| `removeData()` | 删除整个存储键 |
| `cleanFailureData()` | 清理全部已过期键 |

## getStorage

快捷读取：创建（或复用）指定命名空间后读取全部或指定 key。

`getStorage(storageName, storageKey?, isLocal?)`

```ts
import { getStorage } from 'spark-utils/browser'

getStorage('my-app')             // 整个映射
getStorage('my-app', 'user')     // 指定 key 的值
getStorage('my-app', 'user', true)  // 使用 localStorage
```

## webStorage

命名空间对象：`webStorage.createWebStorage` 与 `webStorage.getStorage` 的聚合（便于整体挂载）。

```ts
import { webStorage } from 'spark-utils/browser'

const store = webStorage.createWebStorage('my-app')
webStorage.getStorage('my-app', 'user')
```
