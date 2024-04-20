import { isIE } from './isIE';
import { IEVersion } from './IEVersion';
/**
 * 判断是否是IE10
 * @returns {*|boolean}
 */
export default function isIE10() {
    return isIE() && IEVersion() === 10;
}
export { isIE10 };
