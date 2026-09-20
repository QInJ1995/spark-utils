# 日期时间

日期解析、格式化与计算。全部从主入口具名导入。

::: tip 2.0 变更
- moment 桥接 8 方法（`moment` / `getMoment` / `stringToMoment` / `stringArrayToMomentArray` / `momentToString` / `momentArrayToStringArray` / `dateToMoment` / `momentToDate`）已删除，格式化引擎改用 [dayjs](https://day.js.org/)（`dateToString` token 与 moment 一致）。
- `dateDiff` 与 `getDateDiff` 合并为一个 `dateDiff`。
:::

## 格式 token

`toDateString` / `toStringDate` 使用以下 token（与 xe-utils 体系一致）：

| token | 说明 | token | 说明 |
| --- | --- | --- | --- |
| `yyyy` / `yy` | 年（4 位 / 后 2 位） | `HH` / `H` | 24 小时制（补 0） |
| `MM` / `M` | 月 01-12 | `hh` / `h` | 12 小时制（补 0） |
| `dd` / `d` | 日 01-31 | `mm` / `m` | 分钟（补 0） |
| `ss` / `s` | 秒（补 0） | `SSS` / `S` | 毫秒 |
| `E` / `e` | 星期几（1-7 / 0-6） | `q` | 季度 1-4 |
| `W` / `WW` | 年的第几周 | `D` / `DDD` | 年的第几天 |
| `a` / `A` | am/pm | `Z` / `ZZ` | 时区 |

`dateToString`（dayjs 引擎）使用 dayjs token：`YYYY` / `MM` / `DD` / `HH` / `mm` / `ss` / `SSS` / `Z` 等。

## dateToString

Date / 时间戳 / 日期串 → 格式化字符串（dayjs 实现，token 与 moment 一致）。

`dateToString(date: string | number | Date, format?): string`

```ts
import { dateToString } from 'spark-utils'

dateToString(new Date(), 'YYYY-MM-DD HH:mm:ss')  // '2024-03-05 08:30:00'
dateToString(1709629200000, 'YYYY/MM/DD')        // '2024/03/05'
dateToString('2024-03-05')                        // '2024-03-05T00:00:00+08:00'（缺省 ISO 形态）
dateToString('bad date')                          // 'Invalid date'
```

## toStringDate

任意格式字符串 → Date（支持传 format 精确解析；解析失败返回 Invalid Date）。

`toStringDate(dateStr, format?)`

```ts
import { toStringDate } from 'spark-utils'

toStringDate('2017-12-20 10:10:30')
// Wed Dec 20 2017 10:10:30 GMT+0800
toStringDate('12/20/2017', 'MM/dd/yyyy')
// Wed Dec 20 2017 00:00:00 GMT+0800
toStringDate('20171220101030', 'yyyyMMddHHmmss')
// Wed Dec 20 2017 10:10:30 GMT+0800
```

## toDateString

Date / 时间戳 / 日期串 → 任意格式字符串（token 见上表）。

`toDateString(date, format?, options?)`

```ts
import { toDateString } from 'spark-utils'

toDateString(1483250730000, 'yyyy-MM-dd HH:mm:ss')  // '2017-01-01 14:05:30'
toDateString('2017-01-01 10:05:30', 'MM/dd/yyyy')   // '01/01/2017'
toDateString(new Date(), 'yyyy年MM月dd日')             // '2024年03月05日'
```

## StringToDate

日期字符串 → Date（`new Date(str)` 的直转）。

`StringToDate(dateStr)`

```ts
import { StringToDate } from 'spark-utils'

StringToDate('2021-01-01')  // Date 对象
```

## dateDiff

计算两个日期的差值（2.0 合并了旧 `dateDiff` 与旧 `getDateDiff`）。

```ts
function dateDiff(
  start: string | number | Date | null | undefined,
  end: string | number | Date | null | undefined,
  opts?: DateDiffOptions | DateDiffUnit,
): number | false | DateDiffResult
```

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| start | Date / number / string | 是 | 开始日期 |
| end | Date / number / string | 是 | 结束日期（detailed 模式可缺省取当前时间） |
| opts.unit | `'s' \| 'n' \| 'm' \| 'h' \| 'd' \| 'w' \| 'M' \| 'y'` | 否 | 差值单位，缺省秒 |
| opts.detailed | `boolean` | 否 | `true` 走旧 `getDateDiff` 明细模式 |
| opts.rules | `[string, number][]` | 否 | 明细模式自定义换算规则（`[规则名, 毫秒数]`） |

单位：`'s'` 秒、`'n'`/`'m'` 分钟、`'h'` 小时、`'d'` 天、`'w'` 周、`'M'` 月（自然月差）、`'y'` 年（自然年差）。

```ts
import { dateDiff } from 'spark-utils'

// 单位模式（旧 dateDiff）：字符串第三参仍兼容
dateDiff('2021-01-01', '2021-01-02', 'd')            // 1
dateDiff('2021-01-01', '2021-01-02', { unit: 'd' })  // 1（2.0 规范形态）
dateDiff('2024-01-01 00:00:00', '2024-01-01 01:00:00', { unit: 'm' })  // 60

// 明细模式（旧 getDateDiff）
dateDiff('2017-11-20', '2017-12-21', { detailed: true })
// { done: true, time: 2678400000, yyyy: 0, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0 }
```

::: tip 2.0 变更
- 旧 `getDateDiff(start, end, rules)` → `dateDiff(start, end, { detailed: true, rules })`；
- `'m'` 为分钟的 2.0 规范名（与旧名 `'n'` 等价；旧版 `'m'` 未映射会落入默认秒，属命名疏漏）；
- 单位模式入参非法返回 `false`；明细模式结束日期缺省取当前时间，非法或结束不晚于开始时返回 `{ done: false, time: 0 }`。
:::

## 当前时间快捷方法

| 方法 | 返回格式 |
| --- | --- |
| `now()` | 当前毫秒时间戳 |
| `timestamp(date?)` | 指定日期/当前的毫秒时间戳 |
| `getCurDate()` | `YYYY-MM-DD` |
| `getCurDateMonth()` | `YYYY-MM` |
| `getCurDateTime()` | `YYYY-MM-DD HH:mm:ss` |
| `getCurDateFullTime()` | `YYYY-MM-DD HH:mm:ss.SSS` |
| `getCurQuarter()` | `YYYY年XX季度`（季度两位补零，如 `2024年01季度`） |
| `getCurIssue()` | `YYYYMM`（当前期号） |
| `getCurDateYear()` | `YYYY` |

```ts
import { now, getCurDate, getCurDateTime } from 'spark-utils'

now()            // 1709629200000
getCurDate()     // '2024-03-05'
getCurDateTime() // '2024-03-05 08:30:00'
```

## isTime / isDateTime

`isTime(str)` 是否 `HH:mm:ss` 时间格式；`isDateTime(str)` 是否 `yyyy-MM-dd HH:mm:ss` 日期时间格式。

```ts
import { isTime, isDateTime } from 'spark-utils'

isTime('00:00:00')               // true
isTime('2023-1-1')               // false
isDateTime('2020-01-10 00:00:00') // true
isDateTime('2020-1-1 0:0:0')     // false
```

## getWhatYear / getWhatMonth / getWhatWeek / getWhatDay

相对基准日期的前/后 n 年 / 月 / 周 / 天，可指定 `first` / `last` 等边界。

```ts
import { getWhatYear, getWhatMonth, getWhatWeek, getWhatDay } from 'spark-utils'

getWhatYear('2017-12-20', -1)          // 2016-12-20 的 Date
getWhatYear('2017-12-20', 0, 'first')  // 2017-01-01 00:00:00
getWhatMonth('2017-12-20', 1, 'last')  // 2018-01-31 23:59:59
getWhatWeek('2017-12-20', -1)          // 上周同天
getWhatDay('2017-12-20', 0, 'first')   // 2017-12-20 00:00:00
```

## 年月统计

| 方法 | 说明 |
| --- | --- |
| `getDayOfYear(date, year?)` | 某年份的天数（365/366） |
| `getYearDay(date)` | 某日期是当年的第几天 |
| `getYearWeek(date)` | 某日期是当年的第几周 |
| `getMonthWeek(date)` | 某日期是当月的第几周 |
| `getDayOfMonth(date, months?)` | 某月的天数 |

```ts
import { getDayOfYear, getYearDay, getYearWeek, getMonthWeek, getDayOfMonth } from 'spark-utils'

getDayOfYear('2020-12-20')  // 366（闰年）
getYearDay('2017-01-20')    // 20
getYearWeek('2018-05-20')   // 20
getMonthWeek('2018-05-20')  // 2
getDayOfMonth('2017-12-20') // 31
```
