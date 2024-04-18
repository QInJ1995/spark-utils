/**
 * 获取当前年份YYYY。
 * @method getCurDateYear
 */
export default function getCurDateYear() {
    const d = new Date();
    return d.getFullYear() + '';
}
export { getCurDateYear };
