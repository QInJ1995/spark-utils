import { unserialize, } from './unserialize';
export function getNowPageParam(s) {
  const str = s ? s : document.location.href;
  const url = str.split('?');
  url.shift();
  let param = {};
  url.forEach((item) => {
    if (item) {
      item = item.replace(/#\//g, '');
      param = Object.assign(Object.assign({}, param), unserialize(item));
    }
  });
  return param;
}
export default getNowPageParam;
