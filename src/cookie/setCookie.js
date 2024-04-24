/**
 * @category Cookie操作
 */
/**
 * 设置cookie
 * @param name
 * @param value
 * @param seconds
 * @param path
 */
export function setCookie(name, value, seconds, path) {
    seconds = seconds || 0; // seconds有值就直接赋值，没有为0
    let expires = '';
    if (seconds !== 0) { // 设置cookie生存时间
        const date = new Date();
        date.setTime(date.getTime() + (seconds * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + escape(value) + expires + '; path=' + path; // 转码并赋值
}
export default setCookie;
