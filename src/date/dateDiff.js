import { StringToDate } from './StringToDate';
/**
 * 时间差计算 返回时间差
 * @method dateDiff
 * @author cy
 */
export default function dateDiff(dtStart, dtEnd, strInterval) {
    if (typeof dtEnd === 'string') {
        dtEnd = StringToDate(dtEnd);
    }
    if (typeof dtStart === 'string') {
        dtStart = StringToDate(dtStart);
    }
    if (dtEnd && dtStart) {
        switch (strInterval) {
            case 's':
                return parseInt(String((dtEnd - dtStart) / 1000));
            case 'n':
                return parseInt(String((dtEnd - dtStart) / (60 * 1000)));
            case 'h':
                return parseInt(String((dtEnd - dtStart) / (60 * 60 * 1000)));
            case 'd':
                return parseInt(String((dtEnd - dtStart) / (24 * 60 * 60 * 1000)));
            case 'w':
                return parseInt(String((dtEnd - dtStart) / (7 * 24 * 60 * 60 * 1000)));
            case 'M':
                return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
            case 'y':
                return dtEnd.getFullYear() - dtStart.getFullYear();
            default:
                return parseInt(String((dtEnd - dtStart) / 1000));
        }
    }
    return false;
}
export { dateDiff };
