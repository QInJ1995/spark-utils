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
import { stateFlow, getDataType, uniqueObjects, parseUrlParams  } from 'spark-utils';

// StateFlow
// 初始化并注册
const myStateFlow = new stateFlow('$father', {
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
myStateFlow.action('$child.test')

// 销毁
myStateFlow.destroy() // 销毁所有注入
myStateFlow.destroy('$child') // 销毁指定注入

// getDataType
getDataType(100) // 返回 number

// uniqueObjects
uniqueObjects([{a: 1, b: 3}, {a: 1}, {a: 2}], 'a') // 返回 [{a: 1, b: 3}, {a: 2}]

// arseUrlParams
parseUrlParams('wwww.adc.com?p1=1&p2=2') // 返回 {p1: 1, p2: 2}

```

## 已有方法和计划

1. getDataType 获取传入变量的数据类型
2. StateFlow  状态管理对象可在Vue模块组件共享状态

## 提交规范

- feat：提交新功能
- fix：修复了bug
- docs：只修改了文档
- style：调整代码格式，未修改代码逻辑（比如修改空格、格式化、缺少分号等）
- refactor：代码重构，既没修复bug也没有添加新功能
- perf：性能优化，提高性能的代码更改
- test：添加或修改代码测试
- chore：对构建流程或辅助工具和依赖库（如文档生成等）的更改
