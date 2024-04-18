/**
 * 判断是否为时间格式。
 * @method isTime
 * @param {String} dateval 目标串
 */
export default function isTime(dateval) {
    if (dateval.length !== 8) {
        return false;
    }
    const timeReg = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
    return timeReg.test(dateval);
}
export { isTime };
