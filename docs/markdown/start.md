# 快速开始

<!-- ## Try It Online

You can try VitePress directly in your browser on [StackBlitz](https://vitepress.new). -->

## 前置准备

- 本地安装[Node.js](https://nodejs.org/)  建议16 及以上版本

## 安装

::: code-group

```sh [npm]
$ npm install spark-utils
```

```sh [pnpm]
$ pnpm add spark-utils
```

```sh [yarn]
$ yarn add spark-utils
```

:::

## 使用

```js{4}
// 按需引入
import { isEmpty } from 'spark-utils'
// 全部引入
import SparkUtils from 'spark-utils'

isEmpty()

SparkUtils.isEmpty()

```
