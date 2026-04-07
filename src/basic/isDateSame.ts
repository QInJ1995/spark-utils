import toDateString from '../date/toDateString';

/**
 * 比较两个日期
 *
 * @param {Number/String/Date} date1 日期
 * @param {Number/String/Date} date2 日期
 * @param {String} format 对比格式
 */
function isDateSame(date1: number | string | Date, date2: number | string | Date, format?: string) {
	if (date1 && date2) {
		// @ts-ignore - toDateString 缺少类型定义
		date1 = toDateString(date1, format);
		// @ts-ignore - toDateString 缺少类型定义
		return date1 !== 'Invalid Date' && date1 === toDateString(date2, format);
	}
	return false;
}

export default isDateSame;
