/**
 * 获取当前日期YYYY-MM-DD。
 * @method getCurDate
 */
export default function getCurDate() {
    const d = new Date();
    let ret = d.getFullYear() + '-';
    ret += ('00' + (d.getMonth() + 1)).slice(-2) + '-';
    ret += ('00' + d.getDate()).slice(-2);
    return ret;
}
export { getCurDate };
