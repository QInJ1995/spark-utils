/**
 * 解析动态字符串模板（移植自旧 src/string/template.js）
 *
 * - 默认定界符 {{key}}（/\{{2}([.\w[\]\s]+)\}{2}/g），支持点路径与数组下标
 *   （{{user.profile.city}}、{{list.1.tag}}）；
 * - options.tmplRE 可覆盖定界正则；
 * - 键值先 trim 再按路径取值。
 *
 * 怪癖忠实保留（见 test/fixtures/string/template.json）：
 * - 缺失 key 输出字符串 "undefined"（路径取值返回 undefined 经替换拼接成串）；
 * - 值为 0 时输出 "0"（非 undefined）。
 *
 * 横引消除（2.0 去重）：旧版横向引用 object 域的 get 与本域未迁移的 trim；
 * 现路径取值直取 internal/paths 的共享 getValueByPath（等价于旧 get 不传
 * 默认值的形态；键值来自正则捕获、恒为非空字符串，trim 直接用
 * String.prototype.trim，与旧 trim 的 truthy 分支等价）。
 */
import { getValueByPath } from '../internal/paths'
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
    return getValueByPath(args, key.trim()) as string
  })
}
