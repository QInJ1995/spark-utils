# DOM

DOM 元素信息读取，从 `spark-utils/browser` 子入口导入。

::: tip 2.0 变更
`getStyle` 删除 IE 的 `currentStyle` 分支，统一走 `getComputedStyle`。
:::

## getStyle

获取元素的计算样式值。

`getStyle(el: Element, attr: string): string`

```ts
import { getStyle } from 'spark-utils/browser'

getStyle(document.body, 'padding-top')  // '0px'
getStyle(el, 'width')                   // '100px'
```

## getWidth

获取元素宽度（`getBoundingClientRect`）。

`getWidth(el: Element): number`

```ts
import { getWidth } from 'spark-utils/browser'

getWidth(el)  // 100
```

## getHeight

获取元素高度；第二参传 `true` 时扣除上下内边距与边框（内容高度）。

`getHeight(el: Element, innerHeight?)`

```ts
import { getHeight } from 'spark-utils/browser'

getHeight(el)         // 盒子高度
getHeight(el, true)   // 内容高度（扣除 padding-top/bottom 与 border-top/bottom）
```
