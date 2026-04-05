/**
 * 数组遍历方法
 * 兼容不支持 forEach 的环境，提供统一的数组遍历接口
 *
 * @param list - 要遍历的数组（可能为 null 或 undefined）
 * @param iterate - 回调函数，接收三个参数：(item, index, list)
 *                  item: 当前元素值
 *                  index: 当前元素索引
 *                  list: 原始数组
 * @param context - 可选的上下文对象，作为回调函数的this指向
 */
function arrayEach<T>(
	list: T[] | null | undefined,
	iterate: (item: T, index: number, list: T[]) => void,
	context?: any
) {
	// 检查数组是否存在
	if (list) {
		// 如果浏览器支持原生 forEach 方法，则直接使用
		if (list.forEach) {
			list.forEach(iterate, context);
		} else {
			// 否则使用 for 循环实现兼容性的遍历
			for (let index = 0, len = list.length; index < len; index++) {
				iterate.call(context, list[index], index, list);
			}
		}
	}
}

export default arrayEach;
