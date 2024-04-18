/**
 * 获取当前日期YYYY-MM。
 * @method getCurDateMonth
 */
export default function getCurDateMonth() {
    const d = new Date();
    let ret = d.getFullYear() + '-';
    ret += ('00' + (d.getMonth() + 1)).slice(-2);
    return ret;
}
export { getCurDateMonth };
