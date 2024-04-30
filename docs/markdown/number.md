# 数据处理

## random

获取一个指定范围内随机数

### 参数

`random(min, max)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| min | number | 是 | 最小值 |
| max | number | 是 | 最大值 |

### 返回值

`number`

### 示例

```js

import { random } from 'spark-utils';

random() // 0 ~ 9
random(3, 6) // 3 ~ 6
random(0, 5) // 0 ~ 5
random(10, 100) // 10 ~ 100
                
```

## min

获取最小值

### 参数

`min(array, [iterator])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| array | array | 是 | 数组 |
| iterator | function | 否 | 迭代器 |

### 返回值

`any`

### 示例

```js

import { min } from 'spark-utils';

min([22, 66, 77, 11]) // 11
min([{a: 11}, {a: 44}], 'a') // {a: 11}
min([{a: 11}, {a: 44}], item => item.a) // {a: 11}

```

## max

获取最大值

### 参数

`max(array, [iterator])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| array | array | 是 | 数组 |
| iterator | function | 否 | 迭代器 |

### 返回值

`any`

### 示例

```js

import { max } from 'spark-utils';

max([22, 66, 77, 11]) // 77
max([{a: 11}, {a: 44}], 'a') // {a: 44}
max([{a: 11}, {a: 44}], item => item.a) // {a: 44}

```

## round

将数值四舍五入

### 参数

`round(number, [precision])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| number | number | 是 | 数值 |
| precision | number | 否 | 精度 |

### 返回值

`number`

### 示例

```js

import { round } from 'spark-utils';

round(123.455, 2) // 123.46
round(123.452, 2) // 123.45

```

## ceil

将数值向上舍入

### 参数

`ceil(number, [precision])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| number | number | 是 | 数值 |
| precision | number | 否 | 精度 |

### 返回值

`number`

### 示例

```js

import { ceil } from 'spark-utils';

ceil(123.455, 2) // 123.46

```

## floor

将数值向下舍入

### 参数

`floor(number, [precision])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| number | number | 是 | 数值 |
| precision | number | 否 | 精度 |

### 返回值

`number`

### 示例

```js

import { floor } from 'spark-utils';

floor(123.455, 2) // 123.45

```

## commafy

数值千分位分隔符、小数点

### 参数

`commafy(number, [options])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| number | number | 是 | 数值 |
| options | object | 否 | 配置项 |

## 配置项

| 属性 | 描述 | 类型 |
| --- | --- | --- |
| spaceNumber | 分割位数，默认3 | number |
| separator | 分隔符，默认 | string |
| digits | 只对 number 类型有效，小数位数 | number |
| round | 只对 number 类型有效，四舍五入，默认true | number |
| ceil | 只对 number 类型有效，向上舍入 | number |
| floor | 只对 number 类型有效，向下舍入 | number |

### 示例

```js

import { commafy } from 'spark-utils';

// 千分位格式化
commafy(1000000) // '1,000,000'
// 格式化金额
commafy(1000000.5678, { digits: 2 }) // '1,000,000.57'
// 字符串每隔4位用空格分隔
commafy('6660000000000001', {spaceNumber: 4, separator: ' '}) // '6660 0000 0000 0001'
// 字符串每隔3位用逗号分割
commafy('abcdeabcdeabcdeabcde', { spaceNumber: 5, separator: ' ' }) // 'abcde abcde abcde abcde'

```

## toNumber

转数值

### 参数

`toNumber(num)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| num | string | 是 | 数值 |

### 返回值

`number`

### 示例

```js

import { toNumber } from 'spark-utils';

toNumber(123) // 123
toNumber('12.3') // 12.3
toNumber('abc') // 0

```

## toNumberString

数值转字符串，科学计数转字符串

### 参数

`toNumberString(num)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| num | number | 是 | 数值 |

### 返回值

`string`

### 示例

```js

import { toNumberString } from 'spark-utils';

toNumberString(1e-14) // '0.00000000000001'
toNumberString(1e+22) // '10000000000000000000000'

```

## toInteger

转整数

### 参数

`toInteger(num)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| num | number | 是 | 数值 |

### 返回值

`number`

### 示例

```js

import { toInteger } from 'spark-utils';

toInteger(123) // 123
toInteger('12.3') // 12
toInteger('abc') // 0

```

## add

加法运算

### 参数

`add(num1, num2)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| num1 | number | 是 | 数值 |
| num2 | number | 是 | 数值 |

### 返回值

`number`

### 示例

```js

import { add } from 'spark-utils';

add(10, 20) // 30
add(3.84, 4.78) // 8.62
add(0.4598, 5.024666) // 5.484466

```

## subtract

减法运算

### 参数

`subtract(num1, num2)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| num1 | number | 是 | 数值 |
| num2 | number | 是 | 数值 |

### 返回值

`number`

### 示例

```js

import { subtract } from 'spark-utils';

subtract(20, 10) // 10
subtract(6.66, 3.9) // 2.76
subtract(5.024664, 0.453) // 4.571664

```

## multiply

乘法运算

### 参数

`multiply(num1, num2)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| num1 | number | 是 | 数值 |
| num2 | number | 是 | 数值 |

### 返回值

`number`

### 示例

```js

import { multiply } from 'spark-utils';

multiply(20, 10) // 200
multiply(6.66, 3.7) // 24.642
multiply(5.024664, 0.453) // 2.276172792

```

## divide

除法运算

### 参数

`divide(num1, num2)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| num1 | number | 是 | 数值 |
| num2 | number | 是 | 数值 |

### 返回值

`number`

### 示例

```js

import { divide } from 'spark-utils';

divide(20, 10) // 2
divide(2.997, 0.9) // 3.33
divide(182.967, 25.77) // 7.1

```

## cnMoneyFormat

将数字转换为中文的金额

### 参数

`cnMoneyFormat(num)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| num | number | 是 | 数值 |

### 返回值

`string`

### 示例

```js

import { cnMoneyFormat } from 'spark-utils';

cnMoneyFormat(20) // 贰拾元整
cnMoneyFormat(1000) // 壹仟元整
cnMoneyFormat(123456789) // 壹拾贰万叁仟肆佰伍拾陆元整

```

## moneyFormat

将数字转换为金额显示，每三位逗号隔开

### 参数

`moneyFormat(num)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| num | number | 是 | 数值 |

### 返回值

`string`

### 示例

```js

import { moneyFormat } from 'spark-utils';

moneyFormat(1000) // 1,000
moneyFormat(1000000.222222, 3) // 1,000,000.222
moneyFormat(100.12, 2, '￥') // ￥100.12

```
