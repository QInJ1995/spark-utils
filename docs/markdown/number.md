# 数值金额

数值运算、格式化与金额显示。全部从主入口具名导入。

::: tip 2.0 变更
`commafy` 已并入 `moneyFormat`（千分位逻辑一致），不再单独提供。
:::

## moneyFormat

数字转金额显示：每三位逗号分隔，可指定小数位数与货币符号。

`moneyFormat(money: number | string, decimal?, symbol?): string`

```ts
import { moneyFormat } from 'spark-utils'

moneyFormat(1234567.891, 2)      // '1,234,567.89'
moneyFormat(1234567)             // '1,234,567'
moneyFormat(1234567.891, 2, '$') // '$1,234,567.89'
```

::: tip 2.0 变更
- `moneyFormat(0)` 返回 `'0'`（`0, 2` → `'0.00'`）；旧版误把 0 当非法输入返回 `''`；
- `null` / `undefined` / 空串 / 不可解析字符串仍返回 `''`。
:::

## cnMoneyFormat

数字转中文金额大写。

`cnMoneyFormat(money: number | string): string`

```ts
import { cnMoneyFormat } from 'spark-utils'

cnMoneyFormat(123.45)  // '壹佰贰拾叁元肆角伍分'
cnMoneyFormat(1001)    // '壹仟零壹元整'
```

## 精确运算

`add` / `subtract` / `multiply` / `divide` 四则运算（内部按字符串对阶，规避浮点误差）。

```ts
import { add, subtract, multiply, divide } from 'spark-utils'

add(0.1, 0.2)      // 0.3（而非 0.30000000000000004）
subtract(1.5, 1)   // 0.5
multiply(3, 0.3)   // 0.9
divide(0.6, 0.2)   // 3（精度修正）
```

## 取整与舍入

| 方法 | 说明 |
| --- | --- |
| `round(num, digits?)` | 四舍五入 |
| `ceil(num, digits?)` | 向上取整 |
| `floor(num, digits?)` | 向下取整 |
| `toFixed(num, digits?)` | 转固定小数位字符串 |

```ts
import { round, ceil, floor, toFixed } from 'spark-utils'

round(0.125, 2)   // 0.13
ceil(0.11, 2)     // 0.12
floor(0.19, 1)    // 0.1
toFixed(0.125, 2) // '0.13'
```

## 数值转换

| 方法 | 说明 |
| --- | --- |
| `toNumber(value)` | 转数字（失败返回 `NaN` / 第二参兜底） |
| `toNumberString(value)` | 转数字字符串（科学计数法展开为十进制字面量） |
| `toInteger(value)` | 转整数 |

```ts
import { toNumber, toNumberString, toInteger } from 'spark-utils'

toNumber('1.5')          // 1.5
toNumber('abc', 0)       // 0
toNumberString(1e-7)     // '0.0000001'
toInteger('3.7')         // 3
```

## 极值与随机

`min(array, iterate?)` / `max(array, iterate?)` 取数组极值（可按回调或属性路径取值比较，返回原数组元素）；`random(min, max)` 返回区间内随机整数（max 缺省为 9）。

```ts
import { min, max, random } from 'spark-utils'

min([11, 22, 3])                       // 3
max([{ n: 2 }, { n: 8 }], 'n')         // { n: 8 }
random(1, 100)                         // 1-100 随机整数
```
