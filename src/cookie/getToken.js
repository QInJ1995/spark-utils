/**
 * 获取token方法
 * @param name
 */
export function getToken(name) {
    const strCookie = document.cookie; // 获取cookie字符串
    const arrCookie = strCookie.split('; '); // 分割
    if (!name) {
        name = 'XSRF-TOKEN';
    }
    // 遍历匹配
    let token = '';
    arrCookie.map((value) => {
        if (value.indexOf(name) !== -1) {
            token = value.slice(name.length + 1);
        }
    });
    return token;
}
export default getToken;
