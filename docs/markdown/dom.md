# DOM元素信息

## getStyle

获取元素样式：obj dom节点；attr属性为样式的名称，例如 padding margin等

### 参数

`getStyle(dom, attr)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| dom | DOM元素 | 是 | 元素节点 | - |
| attr | string | 是 | 属性名称 | - |

### 返回值

`string`

### 示例

```js

import { getStyle } from 'spark-utils';

const dom = document.getElementById('dom');

console.log(getStyle(dom, 'padding'));

```

## getWidth

获取元素的宽度

### 参数

`getWidth(dom)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| dom | DOM元素 | 是 | 元素节点 | - |

### 返回值

`number`

### 示例

```js

import { getWidth } from 'spark-utils';

const dom = document.getElementById('dom');

console.log(getWidth(dom));

```
    
## getHeight

获取元素的高度

### 参数

`getHeight(dom, [isInnerHeight])`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| dom | DOM元素 | 是 | 元素节点 | - |
| isInnerHeight | boolean | 否 | 是否获取内部高度 | false |

### 返回值

`number`

### 示例

```js

import { getHeight } from 'spark-utils';

const dom = document.getElementById('dom');

console.log(getHeight(dom));

```
