import isArray from './isArray';
import arrayEach from '../array/arrayEach';
import objectEach from '../object/objectEach';

/**
 * 迭代器
 *
 * @param {Object} obj 对象/数组
 * @param {Function} iterate(item, index, obj) 回调
 * @param {Object} context 上下文
 * @return {Object}
 */

function each<T>(
	obj: T[] | Record<string, any>,
	iterate: (item: any, index: number | string, obj: T[] | Record<string, any>) => void,
	context?: any
): void {
	if (obj) {
		if (isArray(obj)) {
			arrayEach(obj as T[], iterate as (item: T, index: number, list: T[]) => void, context);
		} else {
			objectEach(
				obj as Record<string, any>,
				iterate as (value: any, key: string, obj: Record<string, any>) => void,
				context
			);
		}
	}
}

export default each;
