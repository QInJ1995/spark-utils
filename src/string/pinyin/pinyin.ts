/**
 * 拼音转换（移植自旧 src/string/pinyin.js 逻辑部分）
 *
 * 旧版为 IIFE 构造 Pinyin 类并导出单例实例（字典挂 this 实例属性、
 * 工具方法挂 prototype）。本模块改为：
 * - 字典数据独立为 ./dict.ts（charDict / fullDict / polyphone）；
 * - 原型方法（getFullChars / getCamelChars / _getFullChar / _capitalize /
 *   _getChar / _getResult）内化为模块私有函数；
 * - 实例状态 options 改为模块级闭包变量，init({ ...defaults, ...ops })
 *   与旧 extend 逐属性覆盖语义等价；
 * - 公共 API 收敛为导出模块对象 pinyin（init / getFullChars / getCamelChars）。
 *
 * 行为基准（见 test/fixtures/string/pinyin.json，已用旧版实测校准）：
 * - getFullChars('我喜欢你') → 'WoXiHuanNi'，非汉字原样保留；
 * - getCamelChars('我喜欢你') → 'WXHN'；checkPolyphone 开启时返回
 *   组合展开后的数组（如 '重' → ['Z', 'C']）；
 * - getCamelChars 非字符串入参抛 Error（旧版 new Error(-1, '函数getFisrt需要
 *   字符串类型参数!') 第二参被忽略，message 实际为 '-1'，此处等价保留）；
 * - CJK 处理范围为码点 19968（一）至 40869（龥），范围外原样返回。
 */
import { charDict, fullDict, polyphone } from './dict'

/** 拼音转换选项 */
export interface PinyinOptions {
  /** 是否检查多音字（开启后 getCamelChars 返回组合数组） */
  checkPolyphone?: boolean
  /** 大小写模式（旧版保留字段，默认 'default'，逻辑未消费） */
  charcase?: string
}

/** 拼音转换器（模块对象，替代旧 prototype 单例） */
export interface PinyinConverter {
  /** 覆盖默认选项（浅合并） */
  init(ops?: PinyinOptions): void
  /** 提取拼音，返回首字母大写形式 */
  getFullChars(str: string): string
  /** 提取首字母，返回大写形式（多音字开启时返回所有组合的数组） */
  getCamelChars(str: string): string | string[]
}

/** 模块级选项状态（旧版闭包默认值 + init 覆盖） */
let options: Required<PinyinOptions> = {
  checkPolyphone: false,
  charcase: 'default',
}

/** 拼音转换模块对象（公共 API） */
export const pinyin: PinyinConverter = {
  init(ops?: PinyinOptions): void {
    options = { ...options, ...ops }
  },

  // 提取拼音, 返回首字母大写形式
  getFullChars(str: string): string {
    let result = ''
    for (let i = 0, len = str.length; i < len; i++) {
      // 旧版 str.substr(i, 1)，等价改写为 charAt(i)
      const ch = str.charAt(i)
      const unicode = ch.charCodeAt(0)
      if (unicode > 40869 || unicode < 19968) {
        result += ch
      } else {
        const name = getFullChar(ch)
        if (name !== false) {
          result += name
        }
      }
    }
    return result
  },

  // 提取首字母，返回大写形式
  getCamelChars(str: string): string | string[] {
    if (typeof str !== 'string') {
      throw new Error('-1')
    }
    const chars: string[] = [] // 保存中间结果的数组
    for (let i = 0, len = str.length; i < len; i++) {
      // 获得unicode码
      const ch = str.charAt(i)
      // 检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
      chars.push(getChar(ch))
    }
    // 处理arrResult,返回所有可能的拼音首字母串数组
    return getResult(chars)
  },
}

/* ---------------------------------------------------------------------------
 * 以下为旧 Pinyin.prototype 私有方法的模块级内化（不导出）
 * ------------------------------------------------------------------------- */

/** 提取拼音（full_dict 按插入序首个命中读音，首字母大写；未命中返回 false） */
function getFullChar(str: string): string | false {
  const keys = Object.keys(fullDict)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as string
    if ((fullDict[key] ?? '').indexOf(str) !== -1) {
      return capitalize(key) as string
    }
  }
  return false
}

/** 首字母大写（空串入参时旧版隐式返回 undefined，此处等价返回 undefined） */
function capitalize(str: string): string | undefined {
  if (str.length > 0) {
    // 旧版 substr(0, 1) / substr(1, str.length)，等价改写为 slice
    const first = str.slice(0, 1).toUpperCase()
    const spare = str.slice(1, str.length)
    return first + spare
  }
  return undefined
}

/** 取单字首字母（多音字返回全部读音首字母串；非汉字原样返回） */
function getChar(ch: string): string {
  const unicode = ch.charCodeAt(0)
  // 如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
  if (unicode > 40869 || unicode < 19968) {
    return ch
  }
  // 检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
  if (!options.checkPolyphone) {
    return charDict.charAt(unicode - 19968)
  }
  // 旧版以数字键索引 polyphone（隐式转字符串），此处显式 String()
  const poly = polyphone[String(unicode)]
  return poly ? poly : charDict.charAt(unicode - 19968)
}

/** 汇总结果：未开多音字直接拼接；开启后按多音字组合展开为数组 */
function getResult(chars: string[]): string | string[] {
  // 如果上面的options对象的checkPolyphone属性，没被修改为true，直接将字符串返回
  if (!options.checkPolyphone) {
    return chars.join('')
  }
  // 定义一个数组， 里面有一个元素，空字符串，
  let result: string[] = ['']
  for (let i = 0, len = chars.length; i < len; i++) {
    const str = chars[i] ?? ''
    const strlen = str.length
    if (strlen === 1) {
      for (let j = 0; j < result.length; j++) {
        result[j] = (result[j] ?? '') + str
      }
    } else {
      const swap1 = result.slice(0)
      result = []
      for (let j = 0; j < strlen; j++) {
        // 复制一个相同的arrRslt
        const swap2 = swap1.slice(0)
        // 把当前字符str[j]添加到每个元素末尾
        for (let k = 0; k < swap2.length; k++) {
          swap2[k] = (swap2[k] ?? '') + str.charAt(j)
        }
        // 把复制并修改后的数组连接到arrRslt上
        result = result.concat(swap2)
      }
    }
  }
  return result
}
