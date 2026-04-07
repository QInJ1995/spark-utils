import isArray from './isArray';
import isString from './isString';
import each from './each';

/**
 * 获取对象的长度或大小
 * @param obj 可以是字符串、数组或对象
 * @returns 返回对象的长度或大小
 * @author QINJIN
 * @email 953373752@qq.com
 */
function getSize(obj: string | any[] | Record<string, any>): number {
	let len = 0; // 用于计数的变量
	// 判断是否为字符串或数组
	if (isString(obj) || isArray(obj)) {
		// 如果是字符串或数组，直接返回其length属性
		return (obj as string | any[]).length;
	}
	// 如果是对象，遍历其属性进行计数
	each(obj as Record<string, any>, function () {
		len++; // 每遍历一个属性，计数器加1
	});
	return len; // 返回最终的计数结果
}

export default getSize;
