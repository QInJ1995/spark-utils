import { isIE } from './isIE';
import { IEVersion } from './IEVersion';
/**
 * 判断是否是不支持的IE版本（版本9以下）
 * @returns {*|boolean}
 */
export default function notSupported() {
    return isIE() && IEVersion() < 9;
}
export { notSupported };
