# 网络

## axios

SparkUtils 内部集成了 [axios](http://www.axios-js.com/zh-cn/) 库，可以直接使用。

### 示例

```js

import { https } from 'spark-utils';
console.log("🚀 ~ axios:", https.axios)

```

## init

初始化

### 参数

`init(options)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| options | object | 是 | 配置项 |

### 返回值

`void`

### 配置项

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| config | object | 否 | axios的基础配置项：可自定义配置， 默认值是：setupDefaults.axiosConfig  |
| interceptors | object | 否 | 拦截配置项：request：请求回调, requestFailed：请求失败回调, response：响应回调, responseFailed：响应失败回调, |

### 示例

```js

import { https } from 'spark-utils';

// 注意！！！ https的get post put delete 方法必须在init之后才会进行注入
https.init({
    config: {
        baseURL: 'http://localhost:8080',
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    },
    interceptors: {
        // 请求拦截器，可以在请求发送之前进行一些处理，比如添加 token
        request: (config) => {
            console.log('request', config);
            return config;
        },
        // 请求拦截器，请求失败处理
        requestFailed: (error) => {
            console.log('requestFailed', error);
        },
        // 响应拦截器，可以在响应返回之前进行一些处理，比如错误统一处理
        response: (response) => {
            console.log('response', response);
            return response;
        },
        // 响应拦截器，响应失败处理
        responseFailed: (error) => {
            console.log('responseFailed', error); 
        }
    },
});

```

## submit

请求提交

### 参数

`submit(options)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| options | object | 是 | 配置项 |

`options`

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| method | string | 是 | POST | 请求方法：GET, POST, PUT, DELETE |
| url | string | 是 | - | 请求地址 |
| data | object | 否 | - |请求参数 |
| autoQs | boolean | 否 | true | 是否自动序列化处理，关闭自动序列化后，HTTP请求头中的Content-Type将会被设置成'application/json; charset=utf-8' |
| config | object | 否 | setupDefaults.axiosConfig | 配置对象 |

### 返回值

`Promise`

### 示例

```js

import { https } from 'spark-utils';

https.submit(
    {
        method: 'POST',
        url: '/api/'
        data: {
            name: '坤坤',
            age: 18,
        },
        autoQs: false, // 开启json提交
        config: {
            timeout: 1000, // 自定此接口设置超时时间
        }
    }
).then((res) => {
    console.log('res', res);
}).catch((err) => {
    console.log('err', err);
});

```
