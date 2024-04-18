/**
 * 提取getCurDateTime和getCurDateFullTime公共代码的函数
 * @param d
 */
export function baseGetCurDateTime(d) {
    let ret = d.getFullYear() + '-';
    ret += ('00' + (d.getMonth() + 1)).slice(-2) + '-';
    ret += ('00' + d.getDate()).slice(-2) + ' ';
    ret += ('00' + d.getHours()).slice(-2) + ':';
    ret += ('00' + d.getMinutes()).slice(-2) + ':';
    return ret;
}
