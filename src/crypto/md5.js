import { CryptoJS } from 'jsrsasign';
/**
 * rsa 签名
 * @param data 明文
 * @return  密文 hex
 * */
export function md5Sign(data) {
    try {
        let rs = CryptoJS.MD5(data).toString();
        return rs;
    }
    catch (e) {
        return false;
    }
}
