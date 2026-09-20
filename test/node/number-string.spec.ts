/**
 * number / string 模块（M3 TS 重写）行为测试
 *
 * 覆盖：
 * - moneyFormat 0 值修复（2.0 有意变更，集成时在 test/overrides.json 登记）与常规千分位；
 * - round / ceil / floor 舍入怪癖（round(-3.5) → -3 等）；
 * - toInteger 与 toNumber 的十六进制差异（parseInt vs parseFloat）；
 * - add / multiply 浮点精度修正；
 * - camelCase / kebabCase 断点怪癖；
 * - escape / unescape 往返与单层解码怪癖；
 * - toFixed 补零 / 借位 / digits=0 / 负数；
 * - toValueString 大数展开 / null / 对象拼接；
 * - uuid RFC4122 v4 形式与紧凑形式；
 * - pinyin 子入口基础转换（prototype 单例 → 模块对象改造后行为不变）。
 */
import { describe, expect, it } from 'vitest'
import {
  add,
  ceil,
  floor,
  moneyFormat,
  multiply,
  random,
  round,
  toFixed,
  toInteger,
  toNumber,
} from '../../src/number'
import {
  camelCase,
  escape,
  format,
  kebabCase,
  toString as toValueString,
  unescape,
  uuid,
} from '../../src/string'
import { pinyin } from '../../src/pinyin'

describe('number.moneyFormat（2.0 修复 0 值）', () => {
  it('0 值不再被 !money 守卫吞为空串', () => {
    expect(moneyFormat(0)).toBe('0')
    expect(moneyFormat(0, 2)).toBe('0.00')
    expect(moneyFormat(0, 2, '￥')).toBe('￥0.00')
  })

  it('常规千分位与符号', () => {
    expect(moneyFormat(1234567.891, 2)).toBe('1,234,567.89')
    expect(moneyFormat(-9876.5, 2)).toBe('-9,876.50')
    expect(moneyFormat(1234.5, 2, '￥')).toBe('￥1,234.50')
  })

  it('空值守卫保持旧版语义', () => {
    expect(moneyFormat(null)).toBe('')
    expect(moneyFormat(undefined)).toBe('')
    expect(moneyFormat('')).toBe('')
    expect(moneyFormat('abc')).toBe('')
  })
})

describe('number.round / ceil / floor', () => {
  it('round 指定小数位与负半数取整怪癖（-3.5 → -3）', () => {
    expect(round(3.14159, 2)).toBe(3.14)
    expect(round(-3.5)).toBe(-3)
  })

  it('ceil 向上取整', () => {
    expect(ceil(4.2)).toBe(5)
    expect(ceil(-4.2)).toBe(-4)
  })

  it('floor 向下取整（-4.2 → -5）', () => {
    expect(floor(4.7)).toBe(4)
    expect(floor(-4.2)).toBe(-5)
  })
})

describe('number.toInteger / toNumber（十六进制差异）', () => {
  it("toInteger('0x1F') 走 parseInt 自动识别进制 → 31", () => {
    expect(toInteger('0x1F')).toBe(31)
  })

  it("toNumber('0x1F') 走 parseFloat → 0", () => {
    expect(toNumber('0x1F')).toBe(0)
  })
})

describe('number.add / multiply（精度修正）', () => {
  it('add(0.1, 0.2) → 0.3', () => {
    expect(add(0.1, 0.2)).toBe(0.3)
  })

  it('multiply(0.07, 100) → 7', () => {
    expect(multiply(0.07, 100)).toBe(7)
  })
})

describe('number.toFixed', () => {
  it('小数不足补零', () => {
    expect(toFixed(1.1, 2)).toBe('1.10')
  })

  it('超出位数借位收缩', () => {
    expect(toFixed(1.234, 2)).toBe('1.23')
  })

  it('digits 为 0 只返回整数部分', () => {
    expect(toFixed(5, 0)).toBe('5')
  })

  it('负数先 round 再取整（-1.5 → -1）', () => {
    expect(toFixed(-1.5)).toBe('-1')
  })
})

describe('string.camelCase / kebabCase', () => {
  it('camelCase 分隔符转驼峰', () => {
    expect(camelCase('project-name')).toBe('projectName')
    expect(camelCase('project-name-list')).toBe('projectNameList')
    expect(camelCase('PROJECTName')).toBe('projectName')
  })

  it('kebabCase 驼峰转短横线（含连续大写断点）', () => {
    expect(kebabCase('projectName')).toBe('project-name')
    expect(kebabCase('FirstName')).toBe('first-name')
    expect(kebabCase('XMLHttpRequest')).toBe('xml-http-request')
  })

  it('kebabCase 大小写断点矩阵（批次⑦补测）', () => {
    expect(kebabCase('aBc')).toBe('a-bc') // 小→大断点
    expect(kebabCase('aBCd')).toBe('a-b-cd') // 连续大写尾部落同段
    expect(kebabCase('ABC')).toBe('abc') // 全大写整体小写不拆
    expect(kebabCase('ABc')).toBe('abc') // 大→小不起断点
    expect(kebabCase('a-B-c')).toBe('a-b-c') // 既有短横线归一
    expect(kebabCase('123')).toBe('123')
    expect(kebabCase('')).toBe('')
  })

  it('camelCase 大小写断点矩阵（含 PROJECT-Name 连续大写怪癖）', () => {
    expect(camelCase('a-b-c')).toBe('aBC')
    expect(camelCase('aBC')).toBe('aBc') // 已驼峰输入基本保持（c 落小写段）
    expect(camelCase('aBCD')).toBe('aBcd')
    expect(camelCase('xABCDy')).toBe('xAbcDy') // 连续大写中间拆段，尾段仅首字母大写
    expect(camelCase('AB')).toBe('ab') // 全大写整体小写
    expect(camelCase('a--b')).toBe('aB') // 连续短横线只出一个断点
    // 旧版怪癖：'PROJECT-Name' 的断点在 projec|T 处，T 保留大写后接 Name
    expect(camelCase('PROJECT-Name')).toBe('projecTName')
  })
})

describe('string.format（脱敏规则分发）', () => {
  it('value 为 null / undefined 直接返回空串（批次⑦补测）', () => {
    expect(format('name', null)).toBe('')
    expect(format('name', undefined)).toBe('')
  })

  it('name / mobile 规则脱敏', () => {
    expect(format('name', '张三')).toBe('张*')
    expect(format('mobile', '13812345678')).toBe('138****5678')
  })
})

describe('string.escape / unescape', () => {
  it('六个保留字符全部转义', () => {
    expect(escape(`<a href="#" class='x'>&\`</a>`)).toBe(
      '&lt;a href=&quot;#&quot; class=&#x27;x&#x27;&gt;&amp;&#x60;&lt;/a&gt;',
    )
  })

  it('escape → unescape 往返还原', () => {
    const source = `<a href="#" class='x'>&\`</a>`
    expect(unescape(escape(source))).toBe(source)
  })

  it('二次转义 / 单层解码怪癖', () => {
    expect(escape('&lt;')).toBe('&amp;lt;')
    expect(unescape('&amp;lt;')).toBe('&lt;')
  })
})

describe('string.toString（toValueString）', () => {
  it('number 入参走 toNumberString（科学计数法展开）', () => {
    expect(toValueString(1e21)).toBe('1000000000000000000000')
  })

  it('null / undefined 返回空串', () => {
    expect(toValueString(null)).toBe('')
    expect(toValueString(undefined)).toBe('')
  })

  it('对象按字符串拼接', () => {
    expect(toValueString({})).toBe('[object Object]')
  })
})

describe('string.uuid', () => {
  it('缺省生成 36 位 RFC4122 v4 形式', () => {
    const id = uuid()
    expect(id).toHaveLength(36)
    // 旧实现 CHARS 为大写十六进制，正则不区分大小写断言版本位与变体位
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('len / radix 紧凑形式限制长度与字符域', () => {
    const compact = uuid(10, 2)
    expect(compact).toHaveLength(10)
    expect(compact).toMatch(/^[01]{10}$/)
  })
})

describe('pinyin 子入口（src/pinyin.ts re-export）', () => {
  it('getFullChars 输出首字母大写全拼', () => {
    expect(pinyin.getFullChars('我喜欢你')).toBe('WoXiHuanNi')
    expect(pinyin.getFullChars('中国')).toBe('ZhongGuo')
  })

  it('getCamelChars 输出首字母缩写', () => {
    expect(pinyin.getCamelChars('我喜欢你')).toBe('WXHN')
  })
})

describe('pinyin 多音字路径（init({ checkPolyphone: true })）', () => {
  it('多音字首字母展开为组合数组，单音字与非汉字原样参与拼接', () => {
    pinyin.init({ checkPolyphone: true })
    try {
      expect(pinyin.getCamelChars('重')).toEqual(['Z', 'C'])
      expect(pinyin.getCamelChars('长')).toEqual(['Z', 'C'])
      expect(pinyin.getCamelChars('我')).toEqual(['W'])
      expect(pinyin.getCamelChars('我重')).toEqual(['WZ', 'WC'])
      expect(pinyin.getCamelChars('a重b')).toEqual(['aZb', 'aCb'])
      // getFullChars 不受多音开关影响
      expect(pinyin.getFullChars('重')).toBe('Zhong')
    } finally {
      pinyin.init({ checkPolyphone: false })
    }
  })

  it('关闭开关后恢复单值返回', () => {
    expect(pinyin.getCamelChars('重')).toBe('Z')
  })
})

describe('number.random（结果不确定不进 fixtures，直陈语义）', () => {
  it('minVal >= maxVal 时原样返回 minVal', () => {
    expect(random(5, 5)).toBe(5)
    expect(random(9, 3)).toBe(9)
  })

  it('结果落在 [minVal>>0, maxVal || 9] 内且为整数', () => {
    for (let i = 0; i < 200; i++) {
      const v = random(1, 3)
      expect(Number.isInteger(v)).toBe(true)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(3)
    }
    // maxVal 缺省按 9
    for (let i = 0; i < 200; i++) {
      const v = random(-2)
      expect(v).toBeGreaterThanOrEqual(-2)
      expect(v).toBeLessThanOrEqual(9)
    }
    // minVal 先 >>0 截断：1.9 → base 1
    for (let i = 0; i < 200; i++) {
      const v = random(1.9)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(9)
    }
  })
})
