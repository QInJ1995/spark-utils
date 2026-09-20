import { isString } from '../internal/type'

/**
 * 用于替代浏览器的 eval 方法（旧 src/basic/evalReplacer.js）
 *
 * 一般来说，直接将 eval 替换为 evalReplacer 即可；
 * 在将 json 字符串转换为对象时，需要在字符串两边各添加一个括号，例如：'(' + jsonStr + ')'。
 * 支持的表达式形态：evalReplacer('2+2')、evalReplacer('(' + jsonStr + ')')、evalReplacer('/sss/')；
 * 禁止语句形态（如 'var a = 1;'，经 Function 构造器抛 SyntaxError）。
 */

/**
 * 用于替代浏览器的 eval 方法
 *
 * @param code 被处理的字符串（非字符串原样返回）
 * @returns 表达式求值结果
 */
export function evalReplacer(code: string): unknown
/**
 * 用于替代浏览器的 eval 方法（非字符串入参原样返回）
 *
 * @param code 被处理的值
 * @returns 原值
 */
export function evalReplacer<T>(code: T): T
export function evalReplacer(code: unknown): unknown {
  if (!isString(code)) {
    return code
  }
  const factory = Function(`return ${code}`) as () => unknown
  return factory()
}
