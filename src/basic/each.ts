import isArray from './isArray';
import arrayEach from '../array/arrayEach';
import objectEach from '../object/objectEach';

/**
 * 遍历数组或对象的每个元素
 * 根据传入的数据类型自动选择数组遍历或对象遍历方法
 *
 * @param obj - 要遍历的数组或对象
 * @param iterate - 回调函数，接收三个参数：(item, index, obj)
 *                  item: 当前元素值
 *                  index: 当前元素索引(数组)或键名(对象)
 *                  obj: 原始数据源
 * @param context - 可选的上下文对象，作为回调函数的this指向
 * @author QINJIN
 * @email 953373752@qq.com
 */
function each<T>(
	obj: T[] | Record<string, any>,
	iterate: (item: any, index: number | string, obj: T[] | Record<string, any>) => void,
	context?: any
): void {
	// 检查对象是否存在
	if (obj) {
		// 判断是否为数组类型，分别调用对应的遍历方法
		if (isArray(obj)) {
			// 数组遍历：使用arrayEach处理数组元素
			arrayEach(obj as T[], iterate as (item: T, index: number, list: T[]) => void, context);
		} else {
			// 对象遍历：使用objectEach处理对象属性
			objectEach(
				obj as Record<string, any>,
				iterate as (value: any, key: string, obj: Record<string, any>) => void,
				context
			);
		}
	}
}

export default each;
