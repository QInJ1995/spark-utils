import hasOwnProp from '../basic/hasOwnProp';

/**
 * 对象遍历方法
 * 遍历对象的自有属性（不包括原型链上的属性）
 *
 * @param obj - 要遍历的对象
 * @param iterate - 回调函数，接收三个参数：(value, key, obj)
 *                  value: 当前属性的值
 *                  key: 当前属性的键名
 *                  obj: 原始对象
 * @param context - 可选的上下文对象，作为回调函数的this指向
 */
function objectEach<T extends Record<string, any>>(
	obj: T | null | undefined,
	iterate: (value: T[keyof T], key: keyof T, obj: T) => void,
	context?: any
) {
	// 检查对象是否存在
	if (obj) {
		// 遍历对象的所有可枚举属性
		for (const key in obj) {
			// 只处理对象自身的属性，排除原型链上的属性
			if (hasOwnProp(obj, key)) {
				iterate.call(context, obj[key as keyof T], key as keyof T, obj);
			}
		}
	}
}

export default objectEach;
