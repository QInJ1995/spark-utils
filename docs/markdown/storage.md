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

### 条目三态解析（get 的取值语义）

底层存储键的值形如 `{ key: 序列化条目 }` 映射，`get` 逐条按三态解析：

| 条目形态 | 判定 | get 行为 |
| --- | --- | --- |
| 损坏 JSON | `JSON.parse` 抛错 | 按缺失处理返回 `null`（打日志） |
| 普通数据（plain） | 解析结果不是「含数字 `updateTime` 的对象」 | 原样返回解析值；**不回写、不删除**——外部写入或永不过期实例写入的数据不会被过期实例损毁 |
| 包装条目（wrapped） | 对象且 `updateTime` 为数字 | 按 `invalidTime` 判定：过期则删除并返回 `null`，命中则解包返回并刷新使用时间 |

两条附注：

- 永不过期实例（`invalidTime: -1`）读到包装条目：解包返回，不刷新不回写；
- `getAll()` 返回的是**条目原始串的浅拷贝映射**（值未经 `JSON.parse` 还原，需要结构时自行解析），与 `get` 的解包语义不同。

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
