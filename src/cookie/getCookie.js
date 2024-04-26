/**
 * 获取cookie
 * @param name
 */
export function getCookie(name) {
  let arr;
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  const isMatch = (arr = document.cookie.match(reg));
  if (isMatch) {
    return unescape(arr[2]);
  }
  else {
    return null;
  }
}
export default getCookie;
