/**
 * 是否是Safari
 * @returns {boolean|boolean}
 */
export default function isSafari() {
    return navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') === -1; // 判断是否Safari浏览器
}
export { isSafari };
