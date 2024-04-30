# Function

## loop

循环执行回调函数，直到超时或回调函数返回`true`停止

### 参数

`loop(callback, time = 500, timeout = 3)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| callback | Function | 是 | 回调函数 |
| time | Number | 否 | 间隔时间，单位毫秒，默认500毫秒 |
| timeout | Number | 否 | 超时时间，单位毫秒，默认3秒 |

### 返回值

`void`

### 示例

```js

import { loop } from 'spark-utils';

loop((i) => {
    console.log(i);
    return i < 10;  
})

loop((i) => {
    console.log(i);
    return i < 10;  
}, 1000, 5) // 当回调函数返回true或者超时5秒时停止

```

## noop

一个空的方法，始终返回 undefined，可用于初始化值

### 参数

`noop()`

### 返回值

`void`

### 示例

```js

import { noop } from 'spark-utils';

[11, 22, 33].map(noop) // [undefined, undefined, undefined]

```

## once

只执行一次的函数

### 参数

`once(callback, [context], [arguments])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| callback | Function | 是 | 回调函数 |
| context | Object | 否 | 上下文 |
| arguments | Array | 否 | 参数 |

### 返回值

`Function`

### 示例

```js

import { once } from 'spark-utils';

let rest = once(function (val) {
    return this.name + ' = ' + val
}, {name: 'test'})
rest(123) // 'test = 123'
rest(456) // 'test = 123'

```

## after

创建一个函数, 调用次数超过 count 次之后执行回调并将所有结果记住后返回

### 参数

`after(count, callback, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| count | Number | 是 | 调用次数 |
| callback | Function | 是 | 回调函数 |
| context | Object | 否 | 上下文 |

### 返回值

`Function`

### 示例

```js

import { after } from 'spark-utils';

function getJSON (url, callback) {
    setTimeout(function() {
    callback({name: 'test1'})
    }, 200)
}

// 如果你想确保所有异步请求完成之后才执行这个函数
let finish = after(3, function (rests) {
    console.log('All finish')
})
getJSON('/api/list1', finish)
getJSON('/api/list2', finish)
getJSON('/api/list3', finish)

```

## before

创建一个函数, 调用次数不超过 count 次之前执行回调并将所有结果记住后返回

### 参数

`before(count, callback, [context])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| count | Number | 是 | 调用次数 |
| callback | Function | 是 | 回调函数 |
| context | Object | 否 | 上下文 |

### 返回值

`Function`

### 示例

```js

import { before } from 'spark-utils';

document.querySelector('.btn').addEventListener('click', before(4, function (rests) {
    console.log('只能点击三次')
}))

```

## delay

该方法和 setTimeout 一样的效果，区别就是支持额外参数

### 参数

`delay(callback, wait, [arguments])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| callback | Function | 是 | 回调函数 |
| wait | Number | 是 | 延迟时间，单位毫秒 |
| arguments | Array | 否 | 参数 |

### 返回值

`void`

### 示例

```js

import { delay } from 'spark-utils';

delay(function (action) {
    console.log("🚀 ~ action:", action) // 唱、跳、rap、篮球 
}, 300, '唱、跳、rap、篮球')

```

## bind

创建一个绑定上下文的函数

### 参数

`bind(callback, context, [arguments])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| callback | Function | 是 | 回调函数 |
| context | Object | 否 | 上下文 |
| arguments | Array | 否 | 参数 |

### 返回值

`Function`

### 示例

```js

import { bind } from 'spark-utils';

let rest = bind(function (val) {
    return this.name + ' = ' + val
}, {name: 'test'})
rest('坤') // 'test = 坤'
rest('少') // 'test = 少'

```

## throttle

节流函数；当被调用 n 毫秒后才会执行，如果在这时间内又被调用则至少每隔 n 秒毫秒调用一次该函数

### 参数

`throttle(callback, wait, [options])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| callback | Function | 是 | 回调函数 |
| wait | Number | 是 | 延迟时间，单位毫秒 |
| options | Object | 否 | 配置项 |

### 配置项

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| leading | Boolean | 否 | 是否在延迟开始前调用 |
| trailing | Boolean | 否 | 是否在延迟结束后调用 |

### 返回值

`Function`

### 示例

```js

import { throttle } from 'spark-utils';

function scrollEvent (evnt) {
        console.log('至少每隔wait秒毫秒之内只会调用一次')
    }

    // 在计时结束之前执行
    document.body.addEventListener('scroll', throttle(scrollEvent, 100))
    // 在计时结束之前执行
    document.body.addEventListener('scroll', throttle(scrollEvent, 100, {
        leading: true,
        trailing: false
    }))
    // 在计时结束之后执行
    document.body.addEventListener('scroll', throttle(scrollEvent, 100, {
        leading: false,
        trailing: true
    }))

    let func = throttle(function (msg) {
        console.log(msg)
    }, 300)
    func('执行一次')
    func.cancel()
    func('取消后中断计时，再次调用会马上执行')

```

## debounce

防抖函数；当被调用 n 毫秒后才会执行，如果在这时间内又被调用则将重新计时，直到 n 毫秒后才会执行

### 参数

`debounce(callback, wait, [options])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| callback | Function | 是 | 回调函数 |
| wait | Number | 是 | 延迟时间，单位毫秒 |
| options | Object | 否 | 配置项 |

### 配置项

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| leading | Boolean | 否 | 是否在延迟开始前调用 |
| trailing | Boolean | 否 | 是否在延迟结束后调用 |

### 返回值

`Function`

### 示例

```js

import  { debounce } from 'spark-utils';

function resizeEvent (evnt) {
    console.log('如果wait毫秒内重复调用则会重新计时，在函数最后一次调用wait毫秒之后才会执行回调')
}

// 在计时结束之后执行
document.addEventListener('resize', debounce(resizeEvent, 100))
// 在计时结束之前执行
document.addEventListener('resize', debounce(resizeEvent, 100, true))
// 在计时结束之前执行
document.addEventListener('resize', debounce(resizeEvent, 100, {
    leading: true,
    trailing: false
}))
// 在计时结束之后执行
document.addEventListener('resize', debounce(resizeEvent, 100, {
    leading: false,
    trailing: true
}))

let func = debounce(function (msg) {
    console.log(msg)
}, 300)
func('计时结束之前执行一次')
func.cancel()
func('取消后中重新计时，在计时结束之前执行')

```
