import { stringToMoment } from './stringToMoment';
import isNumber from '../basic/isNumber';
import { isMoment } from '../basic/isMoment';
// @ts-ignore
import moment from 'moment';
moment.locale('zh-cn');
export { moment, };
/**
 * 日期转换成moment日期格式
 * @method getMoment
 * @param {String,moment} value 目标串
 * @param {String} format 格式
 */
export default function getMoment(value, format) {
    // 如果参数列表长度为0，则返回当前时间
    if (arguments.length === 0) {
        return moment();
    }
    if (isMoment(value)) {
        return value;
    }
    if (isNumber(value)) {
        return moment(value);
    }
    const returnValue = stringToMoment(value + '', format !== null && format !== void 0 ? format : '');
    // @ts-ignore
    if (!(returnValue === null || returnValue === void 0 ? void 0 : returnValue.isValid()) || (returnValue === null || returnValue === void 0 ? void 0 : returnValue.format()) === 'Invalid date') {
        return null;
    }
    return returnValue;
}
export { getMoment };
