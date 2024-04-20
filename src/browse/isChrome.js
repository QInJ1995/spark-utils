/**
 * 是否是chrome
 * @returns {boolean|boolean}
 */
export default function isChrome() {
    return navigator.userAgent.indexOf('Chrome') > -1 && navigator.userAgent.indexOf('Safari') > -1;
}
export { isChrome };
