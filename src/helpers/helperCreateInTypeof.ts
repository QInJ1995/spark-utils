/**
 * 创建基于 typeof 的类型检查函数
 *
 * @param {string} type - 要检查的 JavaScript 类型（如 'undefined'、'number'、'string' 等）
 * @returns {(obj: unknown) => boolean} - 返回一个函数，用于检查传入的值是否为指定类型
 *
 * @example
 * const isUndefined = helperCreateInTypeof('undefined');
 * isUndefined(undefined); // true
 * isUndefined(null); // false
 */
function helperCreateInTypeof(type: string): (obj: unknown) => boolean {
	return function (obj: unknown): boolean {
		return typeof obj === type;
	};
}

export default helperCreateInTypeof;
