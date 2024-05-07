# 浏览器工具

## browse

获取浏览器信息

### 参数

`browse()`

### 返回

`Object`

### 示例

```js

import { browse } from 'spark-utils';

browse();
// {
//     "isNode": false,
//     "isMobile": false,
//     "isPC": true,
//     "isDoc": true,
//     "-webkit": true,
//     "-khtml": false,
//     "-moz": false,
//     "-ms": false,
//     "-o": false,
//     "edge": false,
//     "firefox": false,
//     "msie": false,
//     "safari": false,
//     "isLocalStorage": true,
//     "isSessionStorage": true
// }

```

## sendMessage

页面传值

### 参数

`sendMessage(target, callFun, [arg], [callBackFun])`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| target | String | 是 | iframe控件的ID）/object（iframe window,eq:如果是向父页面发送消息,则传window.parent） | window.top |
| callFun | - | 是 | 要访问目标html的方法名,一般这个方法是放在window上的 | - |
| arg | object | 否 | 访问目标iframe的方法的参数 | - |
| callBackFun | function | 否 | 消息反馈时调用的方法名,一般这个方法是放在window上的 | - |

### 返回

`undefined`

### 示例

```js

import { sendMessage } from 'spark-utils';

// a.html
<template>
    <ta-button @click="example">将该值传到顶部页面top</ta-button>
</template>
<script>
export default {
    data () {
        return {
        }
    },
    methods: {
        example() {
            sendMessage(null, 'csMessage', { a:'123' })
        }
    }
}
</script>

// top页面
<template>
    <div>
        {{ message }}
    </div>
</template>
<script>
export default {
    data () {
        return {
            message: ''
        }
    },
    mounted () {
        window.csMessage= (value) => {
            console.log(value)
            this.message = value
        }
    }
}
</script>

```

## locat

解析 URL 参数

### 参数

`locat(url)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| url | String | 是 | 需要解析的URL | - |

### 返回

`Object`

### 示例

```js

import { locat, parseUrl } from 'spark-utils';

locat() // parseUrl
// {
//     "href": "http://localhost:8080/",
//     "hash": "",
//     "host": "localhost:8080",
//     "hostname": "localhost",
//     "protocol": "http:",
//     "port": "8080",
//     "search": "",
//     "path": "/",
//     "pathname": "/",
//     "origin": "http://localhost:8080",
//     "hashKey": "",
//     "hashQuery": {},
//     "searchQuery": {}
// }

```

## serialize

序列化查询参数

### 参数

`serialize(obj)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| obj | Object | 是 | 需要序列化的对象 | - |

### 返回

`String`

### 示例

```js

import { serialize, objectToUrlParam } from 'spark-utils';

serialize({ a: 1, b: 2 }) // "a=1&b=2"

objectToUrlParam({ a: 1, b: 2 }) // "a=1&b=2" 

```

## unserialize

反序列化查询参数

### 参数

`unserialize(str)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| str | String | 是 | 需要反序列化的字符串 | - |

### 返回

`Object`

### 示例

```js

import { unserialize, getNowPageParam } from 'spark-utils';

unserialize('a=1&b=2') // { a: 1, b: 2 }

getNowPageParam() // 获取当前url的查询参数，并反序列化为对象

```

## getBaseURL

获取上下文路径

### 参数

`getBaseURL()`

### 返回

`String`

### 示例

```js

import { getBaseURL } from 'spark-utils';

getBaseURL() // 'http://localhost:8080/'

```

## cookie

Cookie 操作函数

### 参数

`cookie(name, value, options)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| name | String | 是 | Cookie 名称 | - |
| value | String | 否 | Cookie 值 | - |
| options | Object | 否 | Cookie 配置项 | - |

### 配置项

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| expires | string | 否 | 过期时间 | - |
| path | String | 否 | Cookie 路径 | - |
| domain | String | 否 | Cookie 域名 | - |
| secure | Boolean | 否 | 是否启用安全协议 | - |
| sameSite | String | 否 | Cookie 是否启用 SameSite 属性 | - |

### 返回

`String`

### 示例

```js
    
import { cookie } from 'spark-utils';

// 获取所有
cookie()
// 根据name获取
cookie('name')
// 删除
cookie('name', null, {expires: -1})
cookie('name', null, {expires: -1, path: '/'})
// 添加/修改
cookie('name', 'value')
// 指定 10 秒后过期
cookie('name', 'value', {expires: '10s'})
// 指定 1 分钟后过期.cookie('name', 'value', {expires: '1m'})
// 指定 1 小时后过期
cookie('name', 'value', {expires: '1H'})
// 指定 1 天后过期
cookie('name', 'value', {expires: '1d'})
// 指定 1 月后过期
cookie('name', 'value', {expires: '1M'})
// 指定 1 年后过期

cookie('name', 'value', {expires: '1y'})
// 指定时间戳后过期

cookie('name', 'value', {expires: 1525541938031})
// 指定日期过期

cookie('name', 'value', {expires: new Date()})
// 指定 UTCString 格式日期

cookie('name', 'value', {expires: new Date().toUTCString()})
// 指定数值 1 天后过期

cookie('name', 'value', {expires: 1})
// 完整设置domain/path/secure/expires

cookie('name', 'value', {domain: 'xxx.com', path: '/', expires: 7, secure: true})

// 批量删除

cookie([{name: 'name', expires: -1}])
// 批量添加/修改

cookie([{name: 'name', value: 'value'}])
// 批量添加并设置domain/path/secure/expires 7天后过期
cookie([{name: 'name', value: 'value', domain: 'xxx.com', path: '/', expires: 7, secure: true}])

// 判断name是否存在
cookie.has(name)
// 添加
cookie.set(name, value, option)
cookie.set(name, value, option).set(name, value, option)
// 根据name获取
cookie.get(name)
// 删除
cookie.remove(name)
cookie.remove(name, {path: '/'})
                
```

## isIE

是否是IE浏览器

### 参数

`isIE()`

### 返回

`Boolean`

### 示例

```js
    
import { isIE } from 'spark-utils';

isIE()

```

## notSupported

是否不支持的浏览器（IE8及以下）

### 参数

`notSupported()`

### 返回

`Boolean`

### 示例

```js
    
import { notSupported } from 'spark-utils';

notSupported()

```

## isIE9

是否是IE9浏览器

### 参数

`isIE9()`

### 返回

`Boolean`

### 示例

```js
    
import { isIE9 } from 'spark-utils';

isIE9()

```

## isIE10

是否是IE10浏览器

### 参数

`isIE10()`

### 返回

`Boolean`

### 示例

```js
    
import { isIE10 } from 'spark-utils';

isIE10()

```

## isIE11

是否是IE11浏览器

### 参数

`isIE11()`

### 返回

`Boolean`

### 示例

```js
    
import { isIE11 } from 'spark-utils';

isIE11()

```

## isChrome

是否是Chrome浏览器

### 参数

`isChrome()`

### 返回

`Boolean`

### 示例

```js
    
import { isChrome } from 'spark-utils';

isChrome()

```

## isFirefox

是否是Firefox浏览器

### 参数

`isFirefox()`

### 返回

`Boolean`

### 示例

```js
    
import { isFirefox } from 'spark-utils';

isFirefox()

```

## isSafari

是否是Safari浏览器

### 参数

`isSafari()`

### 返回

`Boolean`

### 示例

```js
    
import { isSafari } from 'spark-utils';

isSafari()

```

## clientSystem

获取客户端系统信息

### 参数

`clientSystem`

### 返回

`String`

### 示例

```js
    
import { clientSystem } from 'spark-utils';

clientSystem // Mac

```

## clientBrowser

获取客户端浏览器信息

### 参数

`clientBrowser`

### 返回

`String`

### 示例

```js
    
import { clientBrowser } from 'spark-utils';

clientBrowser // Chrome

```

## clientScreenSize

获取客户端屏幕尺寸

### 参数

`clientScreenSize`

### 返回

`String`

### 示例

```js
    
import { clientScreenSize } from 'spark-utils';

clientScreenSize // 1680,1050

```

## copyText

复制字符串到剪切板

### 参数

`copyText(text)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| text | `String` | 是 | 需要复制的文本 | - |

### 返回

`Boolean`

### 示例

```js
    
import { copyText } from 'spark-utils';

copyText('123') // true

```
