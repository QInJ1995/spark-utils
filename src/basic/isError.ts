import helperCreateInInObjectString from '../helpers/helperCreateInInObjectString';

/**
 * 判断是否Error对象
 *
 * @param {unknown} obj 对象
 * @return {Boolean}
 *
 */
const isError = helperCreateInInObjectString('Error');

export default isError;
