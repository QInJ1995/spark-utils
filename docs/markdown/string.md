# 字符串处理

## toString

转字符串

### 参数

`random(any)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| any | any | 否 | 任意类型 |

### 返回值

`string`

### 示例

```js

import { toString } from 'spark-utils';

toString(null) // ''
toString(undefined) // ''
toString(0) // '0'
toString(1e-5) // '0.00001'
                
```

## trim

去除字符串两端的空格

### 参数

`trim(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { trim } from 'spark-utils';

trim('  hello world  ') // 'hello world'
trim('hello world') // 'hello world'

```

## trimLeft

去除字符串左边的空格

### 参数

`trimLeft(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { trimLeft } from 'spark-utils';

trimLeft('  hello world  ') // 'hello world  '
trimLeft('hello world') // 'hello world'

```

## trimRight

去除字符串右边的空格

### 参数

`trimRight(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { trimRight } from 'spark-utils';

trimRight('  hello world  ') // '  hello world'
trimRight('hello world') // 'hello world'

```

## escape

转义HTML字符串，替换&, <, >, ", ', `字符

### 参数

`escape(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { escape } from 'spark-utils';

escape('<div>hello world</div>') // '&lt;div&gt;hello world&lt;/div&gt;'

```

## unescape

反转义HTML字符串，还原&, <, >, ", ', `字符

### 参数

`unescape(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { unescape } from 'spark-utils';

unescape('&lt;div&gt;hello world&lt;/div&gt;') // '<div>hello world</div>'

```

## camelCase

将带驼峰字符串转成字符串

### 参数

`camelCase(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { camelCase } from 'spark-utils';

camelCase('hello-world') // 'helloWorld'

```

## kebabCase

将字符串转成驼峰字符串

### 参数

`kebabCase(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { kebabCase } from 'spark-utils';

kebabCase('helloWorld') // 'hello-world'

```

## repeat

将字符串重复 n 次

### 参数

`repeat(string, n)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |
| n | number | 是 | 重复次数 |

### 返回值

`string`

### 示例

```js

import { repeat } from 'spark-utils';

repeat('hello', 3) // 'hellohellohello'

```

## padStart

头部补全字符串

### 参数

`padStart(string, targetLength, padString)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |
| targetLength | number | 是 | 目标长度 |
| padString | string | 否 | 补全字符串 |

### 返回值

`string`

### 示例

```js

import { padStart } from 'spark-utils';

padStart('hello', 10, ' ') // '    hello'

```

## padEnd

尾部补全字符串

### 参数

`padEnd(string, targetLength, padString)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |
| targetLength | number | 是 | 目标长度 |
| padString | string | 否 | 补全字符串 |

### 返回值

`string`

### 示例

```js

import { padEnd } from 'spark-utils';

padEnd('hello', 10, ' ') // 'hello    '

```

## startsWith

判断字符串是否在源字符串的头部

### 参数

`startsWith(string, searchString, [position])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 源字符串 |
| searchString | string | 是 | 搜索字符串 |
| position | number | 否 | 搜索位置 |

### 返回值

`boolean`

### 示例

```js

import { startsWith } from 'spark-utils';

startsWith('hello world', 'hello') // true

```

## endsWith

判断字符串是否在源字符串的尾部

### 参数

`endsWith(string, searchString, [position])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 源字符串 |
| searchString | string | 是 | 搜索字符串 |
| position | number | 否 | 搜索位置 |

### 返回值

`boolean`

### 示例

```js

import { endsWith } from 'spark-utils';

endsWith('hello world', 'world') // true

```

## template

解析动态字符串模板

### 参数

`template(string, data)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |
| data | object | 是 | 数据 |

### 返回值

`string`

### 示例

```js

import { template } from 'spark-utils';

template('hello {{name}}', {name: 'world'}) // 'hello world'

```

## sortWithCharacter

对数组进行排序(默认为升序,结果数组中按照数字(包含字符串形式),中文,英文进行排列)

### 参数

`sortWithCharacter(array, [options])`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| array | array | 是 | 数组 |
| options | object | 否 | 配置项 |

### 配置项

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| rule | number | 是 | 排序方式,可选值: `1`(升序),`0`(降序) |
| locale | string | 是 | zh/en |

### 返回值

`array`

### 示例

```js

import { sortWithCharacter } from 'spark-utils';

sortWithCharacter(['我', '在', '不4', '不3']) // ['不3', '不4', '我', '在']
sortWithCharacter(['我', '在', '4不', '不3']) // ["4不", "不3", "我", "在"]
sortWithCharacter(['我', '在', '不'], {rule: 0}) // ["在", "我", "不"]
sortWithCharacter(['我', '在', '不'], {rule: 0}) // ["在", "我", "不"]
sortWithCharacter(['wo','我',0,'1',11,'11']) // [0, "1", 11, "11", "我", "wo"]

```

## getFullChars

提取拼音, 返回首字母大写形式

### 参数

`getFullChars(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { pinyin } from 'spark-utils';

pinyin.getFullChars('坤坤') // 'KunKun'

```

## getCamelChars

提取首字母，返回大写形式

### 参数

`getCamelChars(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { pinyin } from 'spark-utils';

pinyin.getCamelChars('坤坤') // 'KK'

```

## _getFullChar

提取拼音

### 参数

`_getFullChar(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { pinyin } from 'spark-utils';

pinyin._getFullChar('坤坤') // 'kunkun'

```

## _capitalize

首字母大写

### 参数

`_capitalize(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 字符串 |

### 返回值

`string`

### 示例

```js

import { pinyin } from 'spark-utils';

pinyin._capitalize('kunkun') // 'Kunkun'

```

## _getChar

传入汉字字符串得到第一个汉字的首字母

### 参数

`_getChar(string)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| string | string | 是 | 汉字字符串 |

### 返回值

`string`

### 示例

```js

import { pinyin } from 'spark-utils';

pinyin._getChar('坤坤') // 'K'

```

## format

格式化处理

### 参数

`format(type,value)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| type | string | 是 | 类型: name,idcard,date,email,zipcode,telphone,mobile,ip |
| value | string | 是 | 值 |


### 返回值

`string`

### 示例

```js

import { format } from 'spark-utils';

format('mobile','18888888888') // 188****8888
format('idcard','44010119900101011') // 44010119900101011
format('date','2020-01-01') // 2020-01-01
format('email','1888888888@qq.com') // 188****88883344
format('name','阿坤') // 阿**

```

## formatWithReq

该方法会将原始数据中，srcReq替换为descReq返回脱敏数据

### 参数

`formatWithReq(str, options)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| str | string | 是 | 原始数据 |
| options | object | 是 | 替换规则对象 |

### options

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| srcReq | string | 是 | 原始数据中需要替换的字符串 |
| descReq | string | 是 | 替换后的字符串 |

### 返回值

`string`

### 示例

```js

import { formatWithReq } from 'spark-utils';

formatWithReq('Hello World!', {srcReq: /Hello/, descReq: "你好"}) // 你好 World!

```

## formatWithIndex

该方法会把指定下标位置替换为*号返回脱敏后数据

### 参数

`formatWithIndex(str, options)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| str | string | 是 | 原始数据 |
| options | Array | 是 | 替换规则对象数组 |

### option

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| start | number | 是 | 需要替换的开始位置下标 |
| stop | number | 是 | 需要替换的结束位置下标 |

### 返回值

`string`

### 示例

```js

import { formatWithIndex } from 'spark-utils';

formatWithIndex('Hello World!', [{start: 0, stop: 5}]) // **** World!

```

## checkPass

判断密码等级

### 参数

`checkPass(str)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| str | string | 是 | 密码 |

### 返回值

`string`

### 示例

```js

import { checkPass } from 'spark-utils';

// 密码等级,分为四种
// 4种字符类型：0-9，a-z，A-Z，特殊字符(不包含空格)
// 难度等级1:6位纯数字
// 难度等级2:4选2，8-20位
// 难度等级3:4选3，8-20位
// 难度等级4:4选4，8-20位
checkPass('123456') // 1

```

## uuid

生成一定长度的随机字符串

### 参数

`uuid(len, base)`

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| len | number/boolean | 否 | 长度: 生成的随机字符串的长度,其值可以是数字或者undefined(false),为undefined(false)的时候生成的是GUID |
| base | number | 否 | 进制: 从这个'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'字符串中在前多少位进行随机选择 |

### 返回值

`string`

### 示例

```js

import { uuid } from 'spark-utils';

uuid(10, 64) // GlEQbH7jlh
uuid(undefined, 64) // E231D14A-14CD-44B8-B075-6F1A3E039A12

```
