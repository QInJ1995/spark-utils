import helperCreateInInObjectString from '../helpers/helperCreateInInObjectString';

/**
 * 判断是否RegExp对象
 *
 * @param {unknown} obj 对象
 * @return {Boolean}
 *
 */
const isRegExp = helperCreateInInObjectString('RegExp');

export default isRegExp;
