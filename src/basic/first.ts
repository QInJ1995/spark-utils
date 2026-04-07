import values from './values';

/**
 * 获取对象或数组的第一个值
 * @param obj - 可以是对象、null或undefined
 * @returns 返回对象的第一个值，如果输入为null或undefined则返回undefined
 * @author QINJIN
 * @email 953373752@qq.com
 */
function first<T extends Record<string, any>>(obj: T | null | undefined): any {
	// 使用values函数获取对象的所有值，然后返回第一个值
	return values(obj)[0];
}

export default first;
