import each from '../basic/each';

/**
 * 创建获取对象属性的高阶函数
 *
 * @param name - Object 静态方法名称（如 'keys'、'values'、'entries'）
 * @param getIndex - 回调函数中参数的索引位置
 *   - 0: 获取值 (values)
 *   - 1: 获取键 (keys)
 *   - 2: 获取键值对 (entries)
 * @returns 返回一个函数，用于获取对象的指定属性
 */
function helperCreateGetObjects(name: 'keys' | 'values' | 'entries', getIndex: number) {
	// 尝试获取 Object 的静态方法（如 Object.keys、Object.values、Object.entries）
	const proMethod = Object[name] as ((obj: any) => any[]) | undefined;

	/**
	 * 获取对象属性的函数
	 * @param obj - 目标对象，可以为 null 或 undefined
	 * @returns 返回包含对象属性的数组
	 */
	return function <T extends Record<string, any>>(obj: T | null | undefined): any[] {
		const result: any[] = [];
		if (obj) {
			// 如果浏览器支持原生方法，直接使用（性能更优）
			if (proMethod) {
				return proMethod(obj);
			}
			// 降级方案：手动遍历对象
			each<T>(
				obj,
				getIndex > 1
					? // entries 模式：将键值对以数组形式推入结果
						function (key) {
							result.push(['' + key, obj[key]]);
						}
					: // keys/values 模式：根据索引获取对应的参数
						function () {
							result.push(arguments[getIndex]);
						}
			);
		}
		return result;
	};
}

export default helperCreateGetObjects;
