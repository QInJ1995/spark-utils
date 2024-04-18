import { getCurDateMonth } from './getCurDateMonth';
/**
 * 获取当前季度YYYY年XX季度
 * @method getCurQuarter
 */
export default function getCurQuarter() {
    const curDateMonth = getCurDateMonth();
    const ary = curDateMonth.split('-');
    let ret = ary[0] + '年';
    const month = Number(ary[1]);
    if (month >= 1 && month <= 3) {
        ret += ('01季度');
    }
    else if (month >= 4 && month <= 6) {
        ret += ('02季度');
    }
    else if (month >= 7 && month <= 9) {
        ret += ('03季度');
    }
    else if (month >= 10 && month <= 12) {
        ret += ('04季度');
    }
    return ret;
}
export { getCurQuarter };
