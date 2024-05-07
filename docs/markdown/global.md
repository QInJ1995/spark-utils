# 全局配置

## setupDefaults

获取全局参数

### 参数

`setupDefaults`

### 返回

`Object`

### 示例

```js
    
import { setupDefaults } from 'spark-utils';

console.log("🚀 ~ setupDefaults:", setupDefaults)

```

## setup

设置全局参数

### 参数

`setup(options)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| options | `Object` | `true` | 全局参数 | - |

### 返回

`void`

### 示例

```js
    
import { setup } from 'spark-utils';

setup({
    "axiosConfig": {
        "baseURL": "",
        "timeout": 10000,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    },
    "promiseResultConfig": {
        "resultKey": "data",
        "verifyConfig": {}
    },
    "treeOptions": {
        "parentKey": "parentId",
        "key": "id",
        "children": "children"
    },
    "formatDate": "yyyy-MM-dd HH:mm:ss.SSSZ",
    "formatString": "yyyy-MM-dd HH:mm:ss",
})

```

## mixin

扩展函数，将您自己的实用函数扩展到 SparkUtils

### 参数

`mixin(func)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| func | `Function` | `true` | 扩展函数 | - |

### 返回

`void`

### 示例

```js
    
import { mixin, getDateDiff } from 'spark-utils';

mixin({
    toDateDiffText (date) {
    let curDate = 1544407800000 // '2018-12-10 10:10:00'
    let dateDiff = getDateDiff(date, curDate)
    if (dateDiff.done) {
        if (dateDiff.time < 31536000000) {
        if (dateDiff.time < 2592000000) {
            if (dateDiff.time < 86400000) {
            if (dateDiff.time < 360000) {
                if (dateDiff.time < 60000) {
                if (dateDiff.time < 10000) {
                    return `刚刚`
                }
                return `${dateDiff.ss}秒之前`
                }
                return `${dateDiff.mm}分钟之前`
            }
            return `${dateDiff.HH}小时之前`
            }
            return `${dateDiff.dd}天之前`
        }
        return `${dateDiff.MM}个月之前`
        }
        return `${dateDiff.yyyy}年之前`
    }
    return '错误类型'
    }
})

SparkUtils.toDateDiffText('2018-12-10 10:09:59') // 刚刚
SparkUtils.toDateDiffText('2018-12-10 10:09:30') // 30秒之前
SparkUtils.toDateDiffText('2018-12-10 10:09:30') // 2分钟之前
SparkUtils.toDateDiffText('2018-12-10 02:10:00') // 8小时之前
SparkUtils.toDateDiffText('2018-12-09 04:09:30') // 1天之前
SparkUtils.toDateDiffText('2018-04-09 04:09:30') // 8个月之前
SparkUtils.toDateDiffText('2016-06-09 04:09:30') // 2年之前

```
