import { moment } from './getMoment';
/**
 * date转换为moment
 * @param {Date}date
 * @returns {moment}
 */
export default function dateToMoment(date) {
    return moment(date);
}
export { dateToMoment };
