/**
 * 解析动态字符串模板（移植自旧 src/string/template.js）
 *
 * - 默认定界符 {{key}}（/\{{2}([.\w[\]\s]+)\}{2}/g），支持点路径与数组下标
 *   （{{user.profile.city}}、{{list.1.tag}}）；
 * - options.tmplRE 可覆盖定界正则；
 * - 键值先 trim 再按路径取值。
 *
 * 怪癖忠实保留（见 test/fixtures/string/template.json）：
 * - 缺失 key 输出字符串 "undefined"（get 返回 undefined 经替换拼接成串）；
 * - 值为 0 时输出 "0"（非 undefined）。
 *
 * 横引消除：旧版横向引用 object 域的 get 与本域未迁移的 trim，string 域禁止
 * 横向引用，故在文件内私有移植（get 来源：旧 src/object/get.js；键值来自正则
 * 捕获、恒为非空字符串，trim 直接用 String.prototype.trim，与旧 trim 的
 * truthy 分支等价）。
 */
import { getHGSKeys, staticHGKeyRE } from '../internal/paths'
import { eqNull, hasOwnProp, isUndefined } from '../internal/type'
import { toValueString } from './toValueString'

/** 模板选项（定界正则覆盖） */
export interface TemplateOptions {
  /** 自定义定界正则（覆盖默认 {{key}}） */
  tmplRE?: RegExp
}

/** 默认定界正则（模块顶层预编译；键允许字母数字、点、方括号与空白） */
const defaultTmplRE = /\{{2}([.\w[\]\s]+)\}{2}/g

/** 解析动态字符串模板：以 args 的属性值替换 str 中的 {{key}} 占位符 */
export function template(str: unknown, args: unknown, options?: TemplateOptions): string {
  return toValueString(str).replace(options?.tmplRE || defaultTmplRE, (_match: string, key: string) => {
    return get(args, key.trim()) as string
  })
}

/* ---------------------------------------------------------------------------
 * 以下为旧 src/object/get.js 的私有移植（仅本文件使用，不导出）：
 * string 域禁止横向引用 object 域，路径取值在此内联实现。
 * ------------------------------------------------------------------------- */

/** 按路径取值（含 "a.b[2]" 数组下标路径；eqNull 入参返回默认值） */
function get(obj: unknown, property: string, defaultValue?: unknown): unknown {
  if (eqNull(obj)) {
    return defaultValue
  }
  const result = getValueByPath(obj, property)
  return isUndefined(result) ? defaultValue : result
}

/** 解析单个路径段（末尾形如 key[2] 时深入索引） */
function getDeepProps(obj: unknown, key: string): unknown {
  const matchs = key ? key.match(staticHGKeyRE) : null
  if (matchs) {
    const record = obj as Record<string, unknown>
    const head = matchs[1]
    const tail = matchs[2]
    if (head) {
      const headVal = record[head]
      return headVal ? (headVal as Record<string, unknown>)[tail ?? ''] : undefined
    }
    return record[tail ?? '']
  }
  return (obj as Record<string, unknown>)[key]
}

/** 逐段沿路径取值（falsy 中断返回 undefined，末段保留 null 结果；空路径返回原对象） */
function getValueByPath(obj: object, property: string): unknown {
  if (obj) {
    const record = obj as Record<string, unknown>
    if (record[property] || hasOwnProp(obj, property)) {
      return record[property]
    }
    const props = getHGSKeys(property)
    const len = props.length
    let rest: unknown = obj
    if (len) {
      for (let index = 0; index < len; index++) {
        rest = getDeepProps(rest, props[index] as string)
        if (eqNull(rest)) {
          if (index === len - 1) {
            return rest
          }
          return undefined
        }
      }
    }
    return rest
  }
  return undefined
}
