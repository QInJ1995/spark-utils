/**
 * 判断是否为日期格式。
 * @method isDateString
 * @param {String} dateval 目标串
 */
export default function isDateString(dateval) {
    let arr = [];
    if (dateval.length !== 10) {
        return false;
    }
    if (dateval.indexOf('-') !== -1) {
        arr = dateval.toString().split('-');
    }
    else if (dateval.indexOf('/') !== -1) {
        arr = dateval.toString().split('/');
    }
    else {
        return false;
    }
    if (arr.length !== 3) {
        return false;
    }
    // var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    // yyyy-mm-dd || yyyy/mm/dd
    if (arr[0].length === 4) {
        const date = new Date(Number(arr[0]), Number(arr[1]) - 1, Number(arr[2]));
        if (date.getFullYear() === Number(arr[0]) && date.getMonth() === Number(arr[1]) - 1 && date.getDate() === Number(arr[2])) {
            return true;
        }
    }
    return false;
}
export { isDateString };
