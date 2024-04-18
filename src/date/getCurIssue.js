/**
 * 获取当前期号YYYYMM。
 * @method getCurIssue
 */
export default function getCurIssue() {
    const d = new Date();
    let ret = d.getFullYear() + '';
    const month = d.getMonth() + 1;
    if (parseInt(String(month)) < 10) {
        ret += ('0' + month);
    }
    else {
        ret += ('' + month);
    }
    return ret;
}
export { getCurIssue };
