# 日志打印

带样式的控制台打印工具。全部从主入口具名导入。

::: tip 2.0 变更（同构）
打印受日志开关控制：**浏览器默认开启，Node 默认静默**（1.x 在 Node 下也会默认打印）。需要在 Node 下输出请先 `setup({ showLog: true })`（`setup` 从主入口具名导入）；旧版关闭时向上遍历 `window.parent` 的 iframe 逃生通道已删除。
:::

## 预置打印函数

`info` / `warning` / `warn`（warning 别名）/ `error` / `success`，签名均为 `(textOrTitle: unknown, content?: unknown) => void`：单参输出「默认标题 + 文本」，双参输出「标题 + 文本」。

```ts
import { info, warning, error, success } from 'spark-utils'

info('普通信息')
warning('注意', '磁盘空间不足')
error('出错了', { code: 500 })
success('保存成功')
```

| 函数 | 标题 | 主题色 |
| --- | --- | --- |
| `info` | Info | #909399 |
| `warning` / `warn` | Warning | #E6A23C |
| `error` | Error | #F56C6C |
| `success` | Success | #67C23A |

## table

对象 / 数组以折叠分组 + 表格形式输出。

`table(textOrTitle, content?)`

```ts
import { table } from 'spark-utils'

table('接口统计', [
  { name: '/login', cost: 120 },
  { name: '/users', cost: 80 },
])
```

## image

在控制台输出图片（浏览器专属，Node 下 no-op）。

`image(urlOrTitle, url?, scale?)`

```ts
import { image } from 'spark-utils'

image('https://example.com/logo.png')
image('logo', 'https://example.com/logo.png', 0.5)  // 标题 + 0.5 倍缩放
```

## createStyledLogger

创建自定义样式的打印函数（预置函数即由它创建）。

```ts
import { createStyledLogger } from 'spark-utils'

const debug = createStyledLogger({ title: 'Debug', color: '#409EFF' })

debug('调试信息')            // [Debug] 调试信息
debug('阶段', '渲染完成')     // [阶段] 渲染完成
```
