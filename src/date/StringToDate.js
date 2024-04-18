import { isDateString } from './isDateString';
import { isDateTime } from './isDateTime';
/**
 * 字符串转换成日期
 * @method StringToDate
 * @author cy
 */
export default function StringToDate(value) {
    if (isDateString(value) || isDateTime(value)) {
        // eslint-disable-next-line
        value = value.replace(/\-/g, '/');
        const stateDate = new Date(value);
        if (stateDate.toString() !== 'Invalid Date') {
            return stateDate;
        }
    }
    return false;
}
export { StringToDate };
