import objectToString from '../constant/static/staticObjectToString';

/**
 * 创建一个用于判断对象类型的辅助函数
 * @param type - 需要判断的对象类型字符串，如 'Array'、'Object' 等
 * @returns 返回一个函数，该函数接受一个对象参数，判断其类型是否与传入的类型匹配
 */
function helperCreateInInObjectString(type: string): (obj: any) => boolean {
	// 返回一个函数，该函数使用 Object.prototype.toString.call 方法判断对象类型
	return function (obj: any) {
		// 将对象的类型字符串与期望的类型进行比较，返回布尔值
		return '[object ' + type + ']' === objectToString.call(obj);
	};
}

export default helperCreateInInObjectString;
