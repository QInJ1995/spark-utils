# spark-utils

## 目的

spark-utils是一个JavaScript实用工具库，里面有各种常用的工具方法

spark-utils 是我在进行真实项目时，常用到的一些工具方法；并且为了加深学习js知识而总结产生的，在项目里我写了大量的注释以及实现的思想和步骤

不仅可以将spark-utils引入到你的项目中，还可以借助此文档来学习js

## 安装

```js
npm install spark-utils
```

## 使用

```js
// 首先先引入需要的方法名
import { StateFlow, onMountDialog, promiseResultHandle } from 'spark-utils'; // 按需引入
import sparkUtils from 'spark-utils'; // 全部引入

// StateFlow 状态管理流
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

// uniqueObjects 对象数组去重
uniqueObjects([{a: 1, b: 3}, {a: 1}, {a: 2}], 'a') // 返回 [{a: 1, b: 3}, {a: 2}]

// parseUrlParams 地址解析
parseUrlParams('wwww.adc.com?p1=1&p2=2') // 返回 {p1: '1', p2: '2'}

// onMountDialog 弹窗挂载（目前只支持VUE）
onMountDialog({
    targetEl: el, // 默认 document.body
    dialog: () => import('dialog.vue'), // 弹窗组件
    propsData: {} // 传入的弹窗组件的参数
    ok: () => {}, // 确认回调
    close: () => {}, // 关闭回调
    callback: () => {}, // 其他回调
})

// promiseResultHandle promise结果处理
// 可以是请求对象
const promise = Promise.resolve({ data: { resultData: [] }, serviceSuccess: true, code: 200 })
promiseResultHandle({ 
    promise, // promise对象
    resultKey: 'data.resultData', // 结果数据key
    verifyConfig: { code: 200, serviceSuccess: true }, // 验证配置
    }).then(res => {
    console.log("🚀 ~ promiseResultHandle ~ res:", res)
})
```

## 已有方法和计划

1. StateFlow  状态管理对象可在Vue模块组件共享状态
2. getDataType 获取传入变量的数据类型
3. uniqueObjects  对象数组去重
4. parseUrlParams  解析URL参数
5. onMountDialog 窗挂挂载（目前只支持VUE）
6. promiseResultHandle promise结果处理

## 提交规范

- feat：提交新功能
- fix：修复了bug
- docs：只修改了文档
- style：调整代码格式，未修改代码逻辑（比如修改空格、格式化、缺少分号等）
- refactor：代码重构，既没修复bug也没有添加新功能
- perf：性能优化，提高性能的代码更改
- test：添加或修改代码测试
- chore：对构建流程或辅助工具和依赖库（如文档生成等）的更改
