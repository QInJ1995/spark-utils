# 字符串

字符串转换、模板、脱敏与校验。全部从主入口具名导入。

::: tip 2.0 变更
原生镜像 `trim` / `trimLeft` / `trimRight` / `repeat` / `padStart` / `padEnd` / `startsWith` / `endsWith` 已删除，请使用 `String.prototype` 同名方法；拼音转换（`getFullChars` / `getCamelChars` 等）拆分至 [`spark-utils/pinyin`](./pinyin) 子入口。
:::

## toString

任意值转字符串（`null` / `undefined` 返回 `''`）。

`toString(value)`

```ts
import { toString } from 'spark-utils'

toString(0)     // '0'
toString(null)  // ''
toString({})    // '[object Object]'
```

## escape / unescape

转义 / 反转义 HTML 实体（`& < > " ' \`）。

```ts
import { escape, unescape } from 'spark-utils'

escape('<a href="a">链接</a>')  // '&lt;a href=&quot;a&quot;&gt;链接&lt;/a&gt;'
unescape('&lt;span&gt;')        // '<span>'
```

## camelCase / kebabCase

字符串转驼峰 / 短横线。

```ts
import { camelCase, kebabCase } from 'spark-utils'

camelCase('project-name')  // 'projectName'
kebabCase('projectName')   // 'project-name'
```

## template

以 `args` 的属性值替换字符串中的 `{{key}}` 占位符（支持点路径，可自定义定界正则）。

`template(str, args, options?: TemplateOptions)`

```ts
import { template } from 'spark-utils'

template('{{name}} 今年 {{age}} 岁', { name: 'spark', age: 2 })
// 'spark 今年 2 岁'
template('{{user.name}}', { user: { name: 'spark' } })  // 'spark'
```

## format

按规则类型脱敏（内置规则：`name` / `idcard` / `date` / `email` / `zipcode` / `telphone` / `mobile`）。

`format(type: string, value: unknown): string`

```ts
import { format } from 'spark-utils'

format('mobile', '13812345678')      // '138****5678'
format('name', '张三丰')             // '张**'
format('email', 'test@example.com')  // '****@example.com'
```

## formatWithReq

按自定义正则规则脱敏（替换串可引用捕获组 `$1` / `$2`…）。

`formatWithReq(value: string, reqRule: ReqRule)`

```ts
import { formatWithReq } from 'spark-utils'

formatWithReq('13812345678', {
  srcReq: /(\d{3})\d*(\d{4})/,  // 保留前 3 后 4
  descReq: '$1****$2',
})  // '138****5678'
```

## formatWithIndex

按下标区间打星（下标 1 基；`start` / `stop` 为 `null` 表示从头 / 到尾）。

`formatWithIndex(value: string, indexRule: IndexRule[])`

```ts
import { formatWithIndex } from 'spark-utils'

formatWithIndex('622202020011223344', [
  { start: 1, stop: 6 },        // 第 1-6 位打星
  { start: 15, stop: null },    // 第 15 位到末尾打星
])  // '******02001122****'
```

## checkPass

判断密码强度等级（0-4），要求不含中文和空格、长度 8-20。

`checkPass(value: string | undefined): number`

```ts
import { checkPass } from 'spark-utils'

checkPass('123456')        // 0（纯数字太弱）
checkPass('abc12345')      // 2
checkPass('Abc@12345')     // 4（大小写 + 数字 + 特殊字符）
```

## sortWithCharacter

按拼音 / 字母对字符串数组原地排序（`localeCompare`，缺省 `locale: 'zh'` 升序）。

`sortWithCharacter(array, option?: SortWithCharacterOption)`

```ts
import { sortWithCharacter } from 'spark-utils'

sortWithCharacter(['香蕉', '苹果', '梨'])
// ['梨', '苹果', '香蕉']（按拼音 li / pingguo / xiangjiao）
```

## uuid

生成随机 uuid（缺省 36 位 RFC4122 v4 形式；传 `len` 生成紧凑串）。

`uuid(len?, radix?)`

```ts
import { uuid } from 'spark-utils'

uuid()       // '5e9eb1a0-5c1f-4b8e-9d3a-1f2a3b4c5d6e'
uuid(10)     // 'aB3xK9pQ2z'（紧凑形式）
```
