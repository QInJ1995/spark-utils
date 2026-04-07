/**
 * 判断对象自身属性中是否具有指定的属性
 *
 * @param obj - 要检查的对象
 * @param key - 要检查的属性键名
 * @returns 如果对象拥有该自有属性则返回 true，否则返回 false
 * @author QINJIN
 * @email 953373752@qq.com
 */
function hasOwnProp<T extends object>(obj: T, key: keyof T): boolean {
	// 使用 Object.prototype.hasOwnProperty.call() 确保调用原始方法，避免原型链污染
	return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

export default hasOwnProp;
