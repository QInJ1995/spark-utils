import { isIE } from './isIE';
import { IEVersion } from './IEVersion';
/**
 * 判断是否是IE9
 * @returns {*|boolean}
 */
export default function isIE9() {
    return isIE() && IEVersion() === 9;
}
export { isIE9 };
