import isString from './isString';

/**
 * 一个函数，用于将输入的代码字符串转换为可执行的函数并执行
 * @param code - 需要被评估的代码，可以是字符串或其他类型
 * @returns 执行代码后的结果，如果输入不是字符串则直接返回输入值
 * @author QINJIN
 * @email 953373752@qq.com
 */
export function evalReplacer(code: unknown): any {
	// 检查输入是否为字符串类型，如果不是则直接返回输入值
	if (!isString(code)) {
		return code;
	}

	// 使用Function构造函数将字符串代码转换为函数并执行
	// 这里使用模板字符串将代码包裹，确保返回值被正确处理
	return Function(`return ${code}`)();
}
export default evalReplacer;
