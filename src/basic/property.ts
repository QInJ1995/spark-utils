/**
 * 返回一个获取对象属性的函数（旧 src/basic/property.js）
 *
 * 旧实现：isNull(obj) ? defs : obj[name]。
 * 取值函数按“无外部闭包引用”要求写法：null 判定内联为 obj === null
 * （与 isNull 逐字等价），函数体只引用自身参数与捕获的 name/defs，
 * 不跨模块取绑定；obj 为 undefined 时仍按旧语义抛 TypeError（不拦截）。
 */

/**
 * 返回一个获取对象属性的函数
 *
 * @param name 属性名
 * @param defs 空值（obj 为 null 时的返回值）
 * @returns 取值函数
 */
export function property(name: string, defs?: unknown): (obj: unknown) => unknown {
  return function (obj: unknown): unknown {
    return obj === null ? defs : (obj as Record<string, unknown>)[name]
  }
}
