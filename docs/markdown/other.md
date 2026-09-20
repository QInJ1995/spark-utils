# 其他方法

状态流、Promise 结果处理与证件校验。全部从主入口具名导入。

::: tip 2.0 变更
`onMountDialog`（Vue2 专属命令式弹窗挂载）已删除，不再随库分发。
:::

## StateFlow

数据状态流：以实例为容器的键值状态管理，支持点路径读写嵌套。

```ts
import { StateFlow } from 'spark-utils'

const flow = new StateFlow('user', { name: 'spark' })

flow.set('user.age', 2)
flow.get('user')        // { name: 'spark', age: 2 }
flow.get('user.name')   // 'spark'
flow.set('theme', 'dark')
flow.destroy()          // 无参清空全部；有参删单键 / 点路径末级键
```

## promiseResultHandle

处理 Promise 结果：按 `resultKey` 深取结果数据，`verifyConfig` 校验失败统一 reject。

`promiseResultHandle(options?): Promise<unknown>`

| 选项 | 说明 | 默认 |
| --- | --- | --- |
| `promise` | 待处理的 Promise | - |
| `resultKey` | 结果数据 key（支持点路径深取） | 全局配置的 `'data'` |
| `verifyConfig` | 校验配置（键值对，逐键与结果全等比对） | 全局配置 |
| `resolveFn` / `rejectFn` | 校验通过 / 失败回调 | - |

```ts
import { promiseResultHandle } from 'spark-utils'

const data = await promiseResultHandle({
  promise: fetch('/api/users').then(res => res.json()),
  resultKey: 'data.list',
  resolveFn: () => console.log('校验通过'),
})
```

## 证件校验

二代身份证、香港身份证、澳门身份证校验。

::: tip 2.0 变更（重要）
三个方法的出参统一为 `{ valid, code?, msg? }` 判别对象（无副作用）：

- 旧版返回形状各异（`validate2ndIdCard` 恒返回 `undefined`、`hkIdVerify` / `macauIdCard` 返回 `true`/`undefined`），且失败仅向 `errors` 数组参数做副作用收集——该出参参数已删除；
- `code` 为机器可读的失败分支码：`LENGTH`（长度）/ `PATTERN`（正则）/ `CHECKSUM`（校验位），`msg` 为失败原因文案。
:::

### validate2ndIdCard

二代身份证校验（18 位，含校验位）。

`validate2ndIdCard(id: string): IDCardResult`

```ts
import { validate2ndIdCard } from 'spark-utils'

validate2ndIdCard('11010519491231002X')
// { valid: true }

validate2ndIdCard('123')
// { valid: false, code: 'LENGTH', msg: '...' }
```

### hkIdVerify

香港身份证校验。

`hkIdVerify(id: string): IDCardResult`

```ts
import { hkIdVerify } from 'spark-utils'

hkIdVerify('A123456(A)')
// { valid: false, code: 'CHECKSUM', msg: '...' }（示例值，以实际校验为准）
```

### macauIdCard

澳门身份证校验。

`macauIdCard(id: string): IDCardResult`

```ts
import { macauIdCard } from 'spark-utils'

macauIdCard('1234567(8)')
// { valid, code?, msg? }
```
