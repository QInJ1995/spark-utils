/**
 * 获取IE版本
 * 这个函数不公开
 * @returns {number}
 * @constructor
 */
export default function IEVersion() {
    // 取得浏览器的userAgent字符串
    // 判断是否IE浏览器
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(navigator.userAgent);
    return parseFloat(RegExp.$1);
}
export { IEVersion };
