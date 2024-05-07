# Cookie操作

## setCookie

根据提供的参数设置cookie

### 参数

`setCookie(name,value,timeout,path)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| name | string | 是 | cookie名称 | - |
| value | string | 是 | cookie值 | - |
| timeout | number | 否 | cookie过期时间，单位秒 | 31536000 |
| path | string | 否 | cookie路径 | 当前页面 |

### 返回值

无

### 示例

```js

import { setCookie } from 'spark-utils';

setCookie('name','value',100,'')

```

## getCookie

获取指定cookie

### 参数

`getCookie(name)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| name | string | 是 | cookie名称 | - |

### 返回值

string

### 示例

```js

import { getCookie } from 'spark-utils';

getCookie('name')

```

## getToken

获取token

### 参数

`getToken(name)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| name | string | 否 | cookie名称 | XSRF-TOKEN |

### 返回值

string

### 示例

```js

import { getToken } from 'spark-utils';

getToken('sparkToken')

```
