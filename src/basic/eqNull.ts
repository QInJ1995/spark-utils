import isNull from './isNull';
import isUndefined from './isUndefined';

/**
 * 判断给定对象是否为null或undefined
 * @param obj 需要检查的对象，类型为unknown
 * @returns 返回布尔值，如果对象是null或undefined则返回true，否则返回false
 * @author QINJIN
 * @email 953373752@qq.com
 */
function eqNull(obj: unknown): boolean {
	// 使用isNull或isUndefined函数判断对象是否为null或undefined，任一条件满足则返回true
	return isNull(obj) || isUndefined(obj);
}

export default eqNull;
