import isString from './isString';
/**
 * 用于替代浏览器的eval方法
 * 一般来说，直接将eval替换为evalReplacer即可
 * 在将json字符串转换为对象时，需要在字符串两边各添加一个括号，例如： '('+jsonStr+')'
 * 这个方法可以支持以下行为：
 * 1. eval('2+2')
 * 2. eval('('+jsonStr+')')
 * 3. eval('/sss/')
 * 这个方法禁止以下的eval行为:
 * 1. eval("var a = 1;");
 *
 * @group 基础方法
 * @group 字符串
 *
 * @remarks
 *
 * **参数列表**
 *
 * | 名称 | 说明 | 类型 | 默认值 |
 * | --- | --- | --- | --- |
 * | code | 被处理的字符串 | string | - |
 *
 * @return {any}
 *
 * @example
 *
 * ```js
 * import { evalReplacer, } from '@yh/ta-utils';
 * evalReplacer('2+2') // 4
 * ```
 */
export function evalReplacer(code) {
  if (!isString(code)) {
    return code;
  }
  return Function(`return ${code}`)();
}
export default evalReplacer;
