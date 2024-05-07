# 其他方法

## StateFlow

状态流

### 示例

```js

import { StateFlow } from 'spark-utils';

// 初始化并注册
const myStateFlow = new StateFlow('$father', {
    fn1: () => {},
    fn2: () => {}
}),

// 注入方法或数据
// 方式1: 通过对象注入
myStateFlow.set('$child', {
    fn3: () => {},
    test: 'test'
})
// 方式2：通过.式注入
myStateFlow.set('$child.fn3', () => {})
myStateFlow.set('$child.test', 'test')

// 触发注入方法
myStateFlow.action('$child.fn3')
myStateFlow.action('$father.fn1')

// 获取注入对象
myStateFlow.get('$child.test')

// 销毁
myStateFlow.destroy() // 销毁所有注入
myStateFlow.destroy('$child') // 销毁指定注入

```

## onMountDialog

对话框挂载

`onMountDialog(options)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| options | object | 是 | - | -|

### options

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| targetEl | String | 否 | 挂载的元素 | document.body |
| dialog | Function | 是 | 弹窗组件 | - |
| propsData | Object | 否 | 传入的弹窗组件的参数 | - |
| ok | Function | 否 | 确认回调 | - |
| close | Function | 否 | 关闭回调 | - |
| callback | Function | 否 | 其他回调 | - |

### 示例

```js

import { onMountDialog } from 'spark-utils';

// 目前只支持 vue 弹窗组件挂载 
onMountDialog({
    targetEl: el, // 默认 document.body
    dialog: () => import('dialog.vue'), // 弹窗组件
    propsData: {} // 传入的弹窗组件的参数
    ok: () => {}, // 确认回调
    close: () => {}, // 关闭回调
    callback: () => {}, // 其他回调
})

```

## promiseResultHandle

处理异步操作结果

`promiseResultHandle(options)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| options | object | 是 | - | -|

### options

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| promise | Promise | 是 | promise对象 | - |
| resultKey | String | 否 | 结果数据key | setupDefaults.promiseResultConfig.resultKey |
| verifyConfig | Object | 否 | 验证配置 | setupDefaults.promiseResultConfig.verifyConfig |

### 示例

```js

import { promiseResultHandle } from 'spark-utils';

const promise = Promise.resolve({ data: { resultData: [] }, serviceSuccess: true, code: 200 })
promiseResultHandle({ 
    promise, // promise对象
    resultKey: 'data.resultData', // 结果数据key
    verifyConfig: { code: 200, serviceSuccess: true }, // 验证配置
    }).then(res => {
    console.log("🚀 ~ promiseResultHandle ~ res:", res)
})
    
```

## validate2ndIdCard

验证二代身份证是否合法

`validate2ndIdCard(idCard, [errors])`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| idCard | String | 是 | 身份证号码 | - |
| errors | Array | 是 | 错误信息 | - |

### 示例

```js

import { validate2ndIdCard } from 'spark-utils';

let errors = []
validate2ndIdCard('51102419990909', errors)
console.log("🚀 ~ errors:", errors) //  ['身份证长度不合法']

```

## hkIdVerify

验证香港身份证是否合法

`hkIdVerify(idCard, [errors])`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| idCard | String | 是 | 身份证号码 | - |
| errors | Array | 是 | 错误信息 | - |

### 示例

```js

import { hkIdVerify } from 'spark-utils';

let errors = []
hkIdVerify('HKSAR1234567890', errors)
console.log("🚀 ~ errors:", errors) //  ['身份证验证失败!不满足正则表达式验证规则(^([A-Z]{1,2})([0-9]{6})([A0-9])$)']

```

## macauIdCard

验证澳门身份证是否合法

`macauIdCard(idCard, [errors])`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| idCard | String | 是 | 身份证号码 | - |
| errors | Array | 是 | 错误信息 | - |

### 示例

```js

import { macauIdCard } from 'spark-utils';

let errors = []
macauIdCard('MO1234567890', errors)
console.log("🚀 ~ errors:", errors) //  ['澳门身份证验证失败!']

```
