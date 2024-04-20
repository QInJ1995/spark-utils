import { unserialize } from './unserialize';
export function getNowPageParam(s) {
    let str = s ? s : document.location.href;
    let url = str.split('?');
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
