# 日期处理

## 日期格式

| 格式 | 说明 |
| --- | --- |
| yyyy | 年份，如2020 |
| MM | 月份，如1-12 |
| dd | 日期，如1-31 |
| HH | 小时，如0-23 |
| mm | 分钟，如0-59 |
| ss | 秒数，如0-59 |
| SSS | 秒数 |
| Z | 秒数 |

## moment

SparkUtils 内部集成了 [moment](http://momentjs.cn/) 库，可以直接使用。

### 示例

```js

import { moment } from 'spark-utils';
console.log("🚀 ~ moment:", moment)

```

## getMoment

获取一个Moment对象

### 参数

`getMoment([stringDate], [format])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| stringDate | string | 否 | 日期字符串 |
| format | string | 否 | 日期格式 |

### 返回值

`Moment`

### 示例

```js

import { getMoment } from 'spark-utils';

getMoment() // 获取当前时间的moment对象
getMoment('2023-1-1','YYYY-MM-DD') // 获取指定时间点的Moment对象
注意: 这个方法可能返回null

```

## stringToMoment

直接从string转换为Moment

### 参数

`stringToMoment(stringDate, format)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| stringDate | string | 是 | 日期字符串 |
| format | string | 是 | 日期格式 |

### 返回值

`Moment`

### 示例

```js

import { stringToMoment } from 'spark-utils';

stringToMoment('2023-1-1','YYYY-MM-DD') // 获取指定时间点的Moment对象
注意: 这个方法可能返回null

```

## stringArrayToMomentArray

直接从string转换为Moment

### 参数

`stringArrayToMomentArray(stringDateArray, format)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| stringDateArray | string[] | 是 | 日期字符串数组 |
| format | string | 是 | 日期格式 |

### 返回值

`Array`

### 示例

```js

import { stringArrayToMomentArray } from 'spark-utils';

stringArrayToMomentArray(['2023-1-1','2023-1-2'],'YYYY-MM-DD') // 获取指定时间点的Moment对象数组
注意: 这个方法可能返回null

```

## momentToString

直接从Moment转换为string

### 参数

`momentToString(moment, format)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| moment | moment | 是 | moment对象 |
| format | string | 是 | 日期格式 |

### 返回值

`String`

### 示例

```js

import { momentToString } from 'spark-utils';

momentToString(moment,'YYYY-MM-DD') // 获取指定时间点的Moment对象
注意: 这个方法可能返回null

```

## momentArrayToStringArray

直接从Moment数组转换为string数组

### 参数

`momentArrayToStringArray(momentArray, format)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| momentArray | moment[] | 是 | moment对象数组 |
| format | string | 是 | 日期格式 |

### 返回值

`Array`

### 示例

```js

import { momentArrayToStringArray } from 'spark-utils';

momentArrayToStringArray([moment('2023-1-1'),moment('2023-1-2')],'YYYY-MM-DD') // 获取指定时间点的Moment对象数组
注意: 这个方法可能返回null

```

## dateToMoment

从Date转换为moment

### 参数

`dateToMoment(date)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | Date对象 |

### 返回值

`Moment`

### 示例

```js

import { dateToMoment } from 'spark-utils';

dateToMoment(new Date())

```

## dateToString

从Date转换为string

### 参数

`dateToString(date, format)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | Date对象 |
| format | string | 是 | 日期格式 |

### 返回值

`String`

### 示例

```js

import { dateToString } from 'spark-utils';
dateToString(new Date(),'YYYY-MM-DD') 

```

## momentToDate

提供从moment到date的转换

### 参数

`momentToDate(moment, isUtc = false)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| moment | moment | 是 | moment对象 |
| isUtc | boolean | 否 | 是否是UTC时间 |

### 返回值

`Date`

### 示例

```js

import { momentToDate } from 'spark-utils';

momentToDate(moment('2023-1-1'))

```

## isTime

判断是否为时间格式

### 参数

`isTime(dateString)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| dateString | string | 是 | 日期字符串 |

### 返回值

`Boolean`

### 示例

```js

import { isTime } from 'spark-utils';

isTime('00:00:00') // true
isTime('2023-1-1') // false
isTime('2023-1-1 00:00:00') // false

```

## isDateTime

判断是否为日期时间格式

### 参数

`isDateTime(dateString)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| dateString | string | 是 | 日期字符串 |

### 返回值

`Boolean`

### 示例

```js

import { isDateTime } from 'spark-utils';

isDateTime('2020-1-1 0:0:0') // false
isDateTime('2020-1-1 00:00:00') // false
isDateTime('2020-01-10 00:00:00') // true

```

## getCurDate

获取当前日期

### 参数

`getCurDate()`

### 返回值

`Sting`

### 示例

```js

import { getCurDate } from 'spark-utils';

getCurDate() // 返回YYYY-MM-DD格式的日期字符串

```

## getCurDateMonth

获取当前日期

### 参数

`getCurDateMonth()`

### 返回值

`Sting`

### 示例

```js

import { getCurDateMonth } from 'spark-utils';

getCurDateMonth() // 返回YYYY-MM格式的日期字符串

```

## getCurDateTime

获取当前时间

### 参数

`getCurDateTime()`

### 返回值

`Sting`

### 示例

```js

import { getCurDateTime } from 'spark-utils';

getCurDateTime() // 返回YYYY-MM-DD HH:mm:ss格式的日期字符串

```

## getCurDateFullTime

获取当前时间

### 参数

`getCurDateFullTime()`

### 返回值

`Sting`

### 示例

```js

import { getCurDateFullTime } from 'spark-utils';

getCurDateFullTime() // 返回YYYY-MM-DD HH:mm:ss.SSS格式的日期字符串

```

## getCurQuarter

获取当前季度YYYY年XX季度

### 参数

`getCurQuarter()`

### 返回值

`Sting`

### 示例

```js

import { getCurQuarter } from 'spark-utils';

getCurQuarter() // 返回YYYY年XX季度

```

## getCurIssue

获取当前期号

### 参数

`getCurIssue()`

### 返回值

`Sting`

### 示例

```js

import { getCurIssue } from 'spark-utils';

getCurIssue() // 获取当前期号YYYYMM

```

## getCurDateYear

获取当前年份YYYY

### 参数

`getCurDateYear()`

### 返回值

`Sting`

### 示例

```js

import  { getCurDateYear } from 'spark-utils';

getCurDateYear() // 获取当前年份YYYY

```

### StringToDate

将日期字符串转换为日期对象

### 参数

`StringToDate(dateStr)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| dateStr | string | 是 | 日期字符串 |

### 返回值

`Date`

### 示例

```js

import { StringToDate } from 'spark-utils';

StringToDate('2021-01-01') // 转换为Date对象

```

## dateDiff

时间差计算

### 参数

`dateDiff(dateStr1, dateStr2, type)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| dateStr1 | string | 是 | 开始日期 |
| dateStr2 | string | 是 | 结束日期 |
| type | string | 否 | 计算类型，可选值：s（秒）/n（分）/h（小时）/d（天）/w（周）/M（月）/y（年）,默认为秒 |

### 返回值

`number`

### 示例

```js

import { dateDiff } from 'spark-utils';

dateDiff('2021-01-01', '2021-01-02', 'd') // 计算日期差，返回天数

```

## now

返回当前时间戳

### 参数

`now()`

### 返回值

`number`

### 示例

```js

import { now } from 'spark-utils';

now() // 返回当前时间戳

```

## timestamp

将日期转为时间戳

### 参数

`timestamp(date)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 日期对象 |

### 返回值

`number`

### 示例

```js

import { timestamp } from 'spark-utils';

timestamp(new Date()) // 返回当前时间戳

```

## toStringDate

任意格式字符串转为日期

### 参数

`toStringDate(dateStr, format)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| dateStr | string | 是 | 日期字符串 |
| format | string | 否 | 日期格式 |

### 返回值

`Date`

### 示例

```js

import { toStringDate } from 'spark-utils';

toStringDate('12/20/2017')
// 如果解析错误则返回 'Invalid Date'
toStringDate('2017-12-20')
// Wed Dec 20 2017 00:00:00 GMT+0800 (中国标准时间)
toStringDate('2017-12-20 10:10:30')
// Wed Dec 20 2017 10:10:30 GMT+0800 (中国标准时间)
toStringDate('2017-12-20T10:10:30.738+0800')
// Wed Dec 20 2017 10:10:30 GMT+0800 (中国标准时间)
toStringDate('2017-12-20T10:10:30.738+01:00')
// Wed Dec 20 2017 17:10:30 GMT+0800 (中国标准时间)
toStringDate('2017-12-20T10:10:30.738Z')
// Wed Dec 20 2017 18:10:30 GMT+0800 (中国标准时间)
toStringDate('12/20/2017', 'MM/dd/yyyy')
// Wed Dec 20 2017 00:00:00 GMT+0800 (中国标准时间)
toStringDate('20171220101030', 'yyyyMMddHHmmss')
// Wed Dec 20 2017 10:10:30 GMT+0800 (中国标准时间)
toStringDate('2017/12/20 10:10:30', 'yyyy/MM/dd HH:mm:ss')
// Wed Dec 20 2017 10:10:00 GMT+0800 (中国标准时间)
toStringDate('12/20/2017 10:10:30.100', 'MM/dd/yyyy HH:mm:ss.SSS')
// Wed Dec 20 2017 10:10:30 GMT+0800 (中国标准时间)
toStringDate('Year:2018 Month:01 Day:26', 'Year:yyyy Month:MM Day:dd')
// Fri Jan 26 2018 00:00:00 GMT+0800 (中国标准时间)
toStringDate('yyyy:2017 MM:01 dd:20', '%%%%:yyyy %%:MM %%:dd')
// Fri Jan 20 2017 00:00:00 GMT+0800 (中国标准时间)

```

## toDateString

日期格式化为任意格式字符串

### 参数

`toStringDate(date, [format], [options])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 日期对象 |
| format | String | 否 | 格式化字符串 |
| options | Object | 否 | 格式化选项 |

### 格式化选项

| 属性 | 描述 | 备注 | 值的范围 |
| --- | --- | --- | --- |
| yy | 年份 | 自动截取后两位 |  |
| yyyy | 年份 |  |  |
| M | 月份 |  | 1~12 |
| MM | 月份 | 自动补0 | 01~12 |
| d | 日 |  | 1~31 |
| dd | 日 | 自动补0 | 01~31 |
| h | 12小时制 |  | 1~12 |
| hh | 12小时制 | 自动补0 | 01~12 |
| H | 24小时制 |  | 0~23 |
| HH | 24小时制 | 自动补0 | 00~23 |
| m | 分钟 |  |  |
| mm | 分钟 | 自动补0 | 00~59 |
| s | 秒 |  |  |
| ss | 秒 | 自动补0 | 00~59 |
| S | 毫秒 |  |  |
| SS | 毫秒 | 自动补0 |  |
| a | am/pm，小写 |  | am/pm |
| A | AM/PM，大写 |  | AM/PM |
| D | 年份的第几天 |  | 1~366 |
| DDD | 年份的第几天 | 自动补0 | 001~366 |
| e | 星期几 |  | 0~6 |
| E | 星期几 |  | 1~7 |
| q | 季度 |  | 1~4 |
| W | 年的第几周 |  | 1~53 |
| WW | 年的第几周 | 自动补0 |  |
| Z | 时区值 |  | [+-]HH:mm |
| ZZ | 时区值 |  | [+-]HHmm |

### 返回值

`String`

### 示例

```js

import { toDateString } from 'spark-utils'

toDateString(1483250730000)
// '2017-01-01 14:05:30'
toDateString(new Date())
// '2017-01-01 14:05:30'
toDateString('2017-01-01 10:05:30', 'MM/dd/yyyy')
// '01/01/2017'
toDateString('2017-01-01 10:05:30', 'M/d/yyyy')
// '1/1/2017'
toDateString(new Date(), 'yyyyMMddHHmmssSSS')
// '20170101140530099'
toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')
// '2017-01-01 14:05:30.099'
toDateString(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS GMTZ')
// '2017-01-01 02:05:30.099 GMT+08:00'
toDateString(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS GMTZZ')
// '2017-01-01 02:05:30.099 GMT+0800'
toDateString(new Date(), 'yyyy-M-d h:m:s.S')
// '2017-1-1 2:5:30.99'
toDateString(new Date(), 'yyyy年MM月dd日 HH时mm分ss秒S毫秒,星期E 第q季度')
// '2017年01月01日 14时05分30秒99毫秒,星期0 第1季度'
toDateString(new Date(), 'yy年M月d日 HH时m分s秒S毫秒,星期E 第q季度')
// '17年1月1日 14时5分30秒99毫秒,星期0 第1季度'
toDateString(new Date(), 'yyyy年MM月dd日 hh时mm分ss秒SSS毫秒 ZZ 星期E e 第q季 今年第D天 a A')
// '2017年01月01日 02时05分30秒099毫秒 +0800 星期0 -1 第1季 今年第1天 pm PM'
toDateString(new Date(), '[yyyy-MM] yyyy-MM-dd')
// 'yyyy-MM 2017-01-01'

```

## getWhatYear

返回前几年或后几年的日期,可以指定年的最初时间(first)、年的最后时间(last)、年的月份(0~11)，默认当前

### 参数

`getWhatYear(date, year, [month])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 基准日期 |
| year | number | 是 | 年数 |
| month | number | 否 | 月份 |

### 返回值

`Date`

### 示例

```js

import { getWhatYear } from 'spark-utils'

getWhatYear(new Date(), -1) // Mon Nov 20 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatYear(1513735830000, -1) // Tue Dec 20 2016 10:10:30 GMT+0800 (中国标准时间)
getWhatYear('2017-12-20', -1) // Tue Dec 20 2016 00:00:00 GMT+0800 (中国标准时间)
getWhatYear('2017-12-20', 1) // Thu Dec 20 2018 00:00:00 GMT+0800 (中国标准时间)
getWhatYear('2017-12-20', 0, 'first') // Sun Jan 01 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatYear('2017-12-20', 0, 'last') // Sun Dec 31 2017 23:59:59 GMT+0800 (中国标准时间)

```

## getWhatMonth

返回前几月或后几月的日期,可以指定月初(first)、月末(last)、天数，默认当前

### 参数

`getWhatMonth(date, month, [day])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 基准日期 |
| month | number | 是 | 月数 |
| day | number | 否 | 天数 |

### 返回值

`Date`

### 示例

```js

import { getWhatMonth } from 'spark-utils'

getWhatMonth(new Date(), -1) // Mon Nov 20 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatMonth(1513735830000, -1) // Mon Nov 20 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatMonth('2017-12-20', -1) // Mon Nov 20 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatMonth('2017-12-20', 1) // Sat Jan 20 2018 00:00:00 GMT+0800 (中国标准时间)
getWhatMonth('2017-12-20', -1, 'first') // Wed Nov 01 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatMonth('2017-12-20', 1, 'last') // Wed Jan 31 2018 23:59:59 GMT+0800 (中国标准时间)

```

## getWhatWeek

返回前几周或后几周的日期,可以指定星期几(0~6)，默认当前

### 参数

`getWhatWeek(date, week, [day])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 基准日期 |
| week | number | 是 | 周数 |
| day | number | 否 | 天数 |

### 返回值

`Date`

### 示例

```js

import { getWhatWeek } from 'spark-utils'

getWhatWeek(new Date(), -1) // Sun Dec 17 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatWeek(1513735830000, -1) // Sun Dec 17 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatWeek('2017-12-20', -1) // Sun Dec 17 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatWeek('2017-12-20', 1) // Sun Dec 31 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatWeek('2017-12-20', -1, 5) // Fri Dec 15 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatWeek('2017-12-20', 1, 0) // Sun Dec 31 2017 00:00:00 GMT+0800 (中国标准时间)

```

## getWhatDay

返回前几天或后几天的日期,可以指定当天最初时间(first)、当天的最后时间(last)

### 参数

`getWhatDay(date, day, [type])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 基准日期 |
| day | number | 是 | 天数 |
| type | string | 否 | 类型 |

### 返回值

`Date`

### 示例

```js

import { getWhatDay } from 'spark-utils'

getWhatDay(new Date(), -1) // Tue Dec 19 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatDay(1513735830000, -1) // Tue Dec 19 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatDay('2017-12-20', -1) // Tue Dec 19 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatDay('2017-12-20', 1) // Tue Dec 21 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatDay('2017-12-20', 0, 'first') // Wed Dec 20 2017 00:00:00 GMT+0800 (中国标准时间)
getWhatDay('2017-12-20', 0, 'last') // Wed Dec 20 2017 23:59:59 GMT+0800 (中国标准时间)

```

## getDayOfYear

返回某个年份的天数,可以指定前几个年或后几个年，默认当前

### 参数

`getDayOfYear(date, [year])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 基准日期 |
| year | number | 否 | 年数 |

### 返回值

`Number`

### 示例

```js

import { getDayOfYear } from 'spark-utils'

getDayOfYear(new Date()) // 365
getDayOfYear(1513735830000) // 365
getDayOfYear('2017-12-20') // 365
getDayOfYear('2019-12-20', 1) // 366
getDayOfYear('2020-12-20') // 366

```

## getYearDay

返回某个年份的第几天

### 参数

`getYearDay(date)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 基准日期 |

### 返回值

`Number`

### 示例

```js

import { getYearDay } from 'spark-utils'

getYearDay(new Date()) // 149
getYearDay('2017-01-20') // 20
getYearDay('2018-05-20') // 140

```

## getYearWeek

返回某个年份的第几周

### 参数

`getYearWeek(date)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 基准日期 |

### 返回值

`Number`

### 示例

```js

import { getYearWeek } from 'spark-utils'

getYearWeek(new Date()) // 22
getYearWeek('2017-01-20') // 3
getYearWeek('2018-05-20') // 20

```

## getMonthWeek

返回某个月份的第几周

### 参数

`getMonthWeek(date)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 基准日期 |

### 返回值

`Number`

### 示例

```js

import { getMonthWeek } from 'spark-utils'

getMonthWeek(new Date()) // 4
getMonthWeek('2017-01-20') // 3
getMonthWeek('2018-05-20') // 2

```

## getDayOfMonth

返回某个月份的天数,可以指定前几个月或后几个月，默认当前

### 参数

`getDayOfMonth(date, [months])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| date | Date | 是 | 基准日期 |

### 返回值

`Number`

### 示例

```js

import { getDayOfMonth } from 'spark-utils'

getDayOfMonth(new Date()) // 31
getDayOfMonth(1513735830000) // 31
getDayOfMonth('2017-12-20') // 31
getDayOfMonth('2017-12-20', -1) // 30
getDayOfMonth('2017-12-20', 1) // 31

```

## getDateDiff

返回两个日期之间差距,如果结束日期小于开始日期 done 为 fasle

### 参数

`getDateDiff(startDate, endDate, [rules])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| startDate | `Date` | 是 | 开始日期 |
| endDate | `Date` | 是 | 结束日期 |
| rules | `String` | 否 | 返回结果的单位，可选值：'day'、'week'、'month'、'year'，默认值：'day' |

### 返回值

`Object`

### 示例

```js

import { getDateDiff } from 'spark-utils'

getDateDiff('2017-11-20', '2017-12-21')
// { done: true, time: 2678400000, yyyy: 0, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0, S: 0 }
getDateDiff('2017-12-20', '2017-12-21')
// { done: true, time: 86400000, yyyy: 0, MM: 0, dd: 1, HH: 0, mm: 0, ss: 0, S: 0 }
getDateDiff('2018-01-01', '2017-12-21')
// { done: false, time: 0 }
let dateDiff = getDateDiff('2017-12-20 10:10:30', '2017-12-21 10:15:00')
let content = `${dateDiff.mm}分${dateDiff.ss}秒`
// '4分30秒'

```
