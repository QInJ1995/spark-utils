const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
/**
 *
 * @param len 生成的长度
 * @param radix 基数,可选任意数
 */
export function uuid(len, radix) {
    let uuid = [];
    let i;
    radix = radix || CHARS.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) {
            uuid[i] = CHARS[0 | Math.random() * radix];
        }
    }
    else {
        // rfc4122, version 4 form
        let r = -1;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = CHARS[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}
export default uuid;
