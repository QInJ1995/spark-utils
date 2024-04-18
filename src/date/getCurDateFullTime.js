import { baseGetCurDateTime } from './baseGetCurDateTime';
/**
 * 获取当前时间YYYY-MM-DD HH:MM:SS.sss。
 * @method getCurDateFullTime
 */
export default function getCurDateFullTime() {
    const d = new Date();
    let ret = baseGetCurDateTime(d);
    ret += ('00' + d.getSeconds()).slice(-2) + '.';
    ret += ('00' + d.getMilliseconds()).slice(-3);
    return ret;
}
export { getCurDateFullTime };
