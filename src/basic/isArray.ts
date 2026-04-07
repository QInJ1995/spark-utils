import helperCreateInInObjectString from '../helpers/helperCreateInInObjectString';

/**
 * 判断是否数组
 *
 * @param {unknown} obj 对象
 * @return {Boolean}
 * @author QINJIN
 * @email 953373752@qq.com
 */
// 优先使用原生 Array.isArray 方法，如果不支持则使用 helperCreateInInObjectString 创建的兼容方法
const isArray = Array.isArray || helperCreateInInObjectString('Array');

export default isArray;
