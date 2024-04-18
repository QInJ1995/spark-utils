import { baseGetCurDateTime } from './baseGetCurDateTime';
/**
 * 获取当前时间YYYY-MM-DD HH:MM:SS。
 * @method getCurDateTime
 */
export default function getCurDateTime() {
    const d = new Date();
    let ret = baseGetCurDateTime(d);
    ret += ('00' + d.getSeconds()).slice(-2);
    return ret;
}
export { getCurDateTime };
