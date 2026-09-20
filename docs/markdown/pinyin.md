# 拼音

汉字转拼音。拼音字典数据量大（893 行），2.0 起拆分至 `spark-utils/pinyin` 独立子入口，避免拖累主包体积。

```ts
import { pinyin } from 'spark-utils/pinyin'
```

::: tip 2.0 变更
1.x 从主入口导入 `getFullChars` / `getCamelChars` 等方法；2.0 收敛为子入口导出的 `pinyin` 模块对象（`init` / `getFullChars` / `getCamelChars`），内部辅助函数（`_getFullChar` 等）不再导出。
:::

## pinyin.getFullChars

提取拼音（首字母大写形式），非汉字原样保留。

`pinyin.getFullChars(str: string): string`

```ts
import { pinyin } from 'spark-utils/pinyin'

pinyin.getFullChars('我喜欢你')   // 'WoXiHuanNi'
pinyin.getFullChars('spark工具')  // 'sparkGongJu'
```

## pinyin.getCamelChars

提取拼音首字母（非汉字原样保留；非字符串入参抛 `Error`）。

`pinyin.getCamelChars(str: string): string | string[]`

```ts
import { pinyin } from 'spark-utils/pinyin'

pinyin.getCamelChars('我喜欢你')  // 'WXHN'
```

## pinyin.init

全局选项设置。

```ts
import { pinyin } from 'spark-utils/pinyin'

pinyin.init({
  checkPolyphone: true,  // 开启多音字检测（getCamelChars 返回组合数组）
})

pinyin.getCamelChars('重')  // ['Z', 'C']（多音展开）
```

选项 `charcase`（大小写模式，缺省 `'default'`）为旧版保留字段，当前逻辑未消费。
