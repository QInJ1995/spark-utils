/**
 * 是否是Firefox
 * @returns {boolean}
 */
export default function isFireFox() {
    return navigator.userAgent.indexOf('Firefox') > -1; // 判断是否Firefox浏览器
}
export { isFireFox };
