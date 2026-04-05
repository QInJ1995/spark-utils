import isNull from './isNull';
import isUndefined from './isUndefined';
/**
 * 判断值是否为 null 或 undefined
 *
 * @param {unknown} obj - 要检查的值
 * @returns {boolean} - 如果值为 null 或 undefined 则返回 true，否则返回 false
 *
 * @example
 * eqNull(null); // true
 * eqNull(undefined); // true
 * eqNull(''); // false
 * eqNull(0); // false
 */
function eqNull(obj: unknown): boolean {
	return isNull(obj) || isUndefined(obj);
}

export default eqNull;
