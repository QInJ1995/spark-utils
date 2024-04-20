import { isIE } from './isIE';
/**
 * 判断是否是IE11
 * @returns {*|boolean}
 */
export default function isIE11() {
    return isIE() && navigator.userAgent.indexOf('rv 11.0') > 0;
}
export { isIE11 };
