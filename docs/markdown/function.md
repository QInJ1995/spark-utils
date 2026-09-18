# 函数

函数执行控制工具。全部从主入口具名导入。

::: tip 2.0 变更
`bind` 已删除——请使用原生 `Function.prototype.bind` 或箭头函数。
:::

## debounce

函数去抖：调用后等待 `wait` 毫秒执行，期间再次调用则重新计时。返回的包装函数带 `cancel()` 方法。

`debounce(callback, wait, options?: DebounceOptions | boolean)`

```ts
import { debounce } from 'spark-utils'

const search = debounce((keyword: string) => {
  console.log('search:', keyword)
}, 300)

search('sp')
search('spark')  // 只在最后一次调用 300ms 后执行一次

search.cancel()  // 取消挂起的执行
```

`options`：`{ leading?: boolean, trailing?: boolean }`，也兼容布尔简写（`true` 等价 `{ leading: true }`、`false` 等价 `{ trailing: true }`）。

::: tip 2.0 变更
1.x 不传第三参会抛 `TypeError`；2.0 第三参可选，缺省按 trailing 执行。
:::

## throttle

函数节流：间隔 `wait` 毫秒内最多执行一次。同样带 `cancel()`。

`throttle(callback, wait, options?: ThrottleOptions | boolean)`

```ts
import { throttle } from 'spark-utils'

window.addEventListener('resize', throttle(() => {
  console.log('resize')
}, 500))
```

::: tip 2.0 变更
与 `debounce` 同型：第三参不传不再抛 `TypeError`。
:::

## once

创建只能调用一次的函数，重复调用只返回第一次的结果。

`once(callback, context?, ...presetArgs?)`

```ts
import { once } from 'spark-utils'

const init = once(() => {
  console.log('只执行一次')
  return 'ready'
})

init()  // 打印并返回 'ready'
init()  // 直接返回 'ready'，不再执行
```

## after

从第 `count` 次调用起执行回调（其后每次调用均执行；回调参数为 `(rests, ...args)`，rests 为前 count 次的首参收集）。

`after(count, callback, context?)`

```ts
import { after } from 'spark-utils'

const ready = after(3, () => console.log('3 次之后触发'))

ready(); ready(); ready()  // 第 3 次调用起打印
```

## before

只在前 `count - 1` 次调用时执行回调，达到次数后不再执行（回调参数为 `(rests, ...args)`，rests 为已执行调用的首参收集）。

`before(count, callback, context?)`

```ts
import { before } from 'spark-utils'

const limit = before(3, (rests, msg) => console.log(msg))

limit('a')  // 打印 'a'
limit('b')  // 打印 'b'
limit('c')  // 不再执行
```

## delay

延迟执行（setTimeout 封装，返回定时器 id，回调可带参）。

`delay(callback, wait, ...args)`

```ts
import { delay } from 'spark-utils'

delay((name: string) => console.log(`hi ${name}`), 300, 'spark')
```

## loop

循环函数：每 `time` 毫秒执行一次回调，回调返回真值或超时（`timeout` 秒，默认 3s）后停止。

`loop(callback, time?, timeout?)`

```ts
import { loop } from 'spark-utils'

// 每 500ms 检查一次，data.ready 时停止，最长 5 秒
loop(() => data.ready, 500, 5)
```

## noop

空函数占位。

```ts
import { noop } from 'spark-utils'

const onDone = config.onDone ?? noop
```
