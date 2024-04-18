import { isDateString } from './isDateString';
import { isTime } from './isTime';
/**
 * 判断是否为日期时间格式。
 * @method isDateTime
 * @param {String} dateval 目标串
 */
export default function isDateTime(dateval) {
    if (dateval.length !== 19) {
        return false;
    }
    const arr = dateval.split(' ');
    if (!isDateString(arr[0])) {
        return false;
    }
    return isTime(arr[1]);
}
export { isDateTime };
