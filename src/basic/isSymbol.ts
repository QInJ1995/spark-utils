import staticStrUndefined from '../constant/static/staticStrUndefined';

/**
 * 判断是否Symbol对象
 *
 * @param {unknown} obj 对象
 * @return {Boolean}
 */
const supportSymbol = typeof Symbol !== staticStrUndefined;
function isSymbol(obj: unknown): boolean {
	return supportSymbol ? typeof obj === 'symbol' : false;
}

export default isSymbol;
