import { moment } from './getMoment';
/**
 * date转换为string
 * @param {Date}date
 * @param {string}format
 * @returns {string}
 */
export default function dateToString(date, format) {
    return moment(date).format(format);
}
export { dateToString, };
