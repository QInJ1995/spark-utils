import CryptoJS from 'crypto-js';
/**
 * aes加密函数
 * 秘钥256位, iv:16位 , mode:CBC , padding:PKCS5Padding  (PKCS5Padding的补码方式，其实就是PKCS7)
 * @param {string} data 加密的字符串
 * @param {string} keyStr 秘钥 192位// 后续自动生成
 * @param {string} ivStr 初始向量 16位
 * @return {string} 加密后的数据 base64
 * **/
export function aesEncrypt(data, keyStr, ivStr) {
	// 需要先对 传过来的秘钥进行裁剪 有长度限制 16/24/32
	let key = CryptoJS.enc.Utf8.parse(keyStr);
	let iv = CryptoJS.enc.Utf8.parse(ivStr);
	let encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, });
	return encrypted.toString();
}
export function aesDecrypt(data, keyStr, ivStr) {
	let key = CryptoJS.enc.Utf8.parse(keyStr);
	let iv = CryptoJS.enc.Utf8.parse(ivStr);
	let decrypt = CryptoJS.AES.decrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, });
	return CryptoJS.enc.Utf8.stringify(decrypt);
}
