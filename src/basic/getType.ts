import isSymbol from './isSymbol';
import isDate from './isDate';
import isArray from './isArray';
import isRegExp from './isRegExp';
import isError from './isError';
import isNull from './isNull';

/**
 * 获取对象的类型
 * @param obj - 需要检查类型的未知对象
 * @return 返回对象的类型字符串
 * @author QINJIN
 * @email 953373752@qq.com
 */
function getType(obj: unknown): string {
	// 检查是否为null
	if (isNull(obj)) {
		return 'null';
	}
	// 检查是否为Symbol类型
	if (isSymbol(obj)) {
		return 'symbol';
	}
	// 检查是否为Date对象
	if (isDate(obj)) {
		return 'date';
	}
	// 检查是否为数组
	if (isArray(obj)) {
		return 'array';
	}
	// 检查是否为正则表达式对象
	if (isRegExp(obj)) {
		return 'regexp';
	}
	// 检查是否为Error对象
	if (isError(obj)) {
		return 'error';
	}
	// 返回基本类型的typeof结果
	return typeof obj;
}

export default getType;
