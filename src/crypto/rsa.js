import { KEYUTIL, KJUR, hextob64, b64tohex, b64toutf8, } from 'jsrsasign';
/**
 * rsa加密
 * @param data 明文
 * @param pubKey 公钥
 * @param algName
 * @return  base64格式
 * */
export function rsaEncrypt(data, pubKey, algName) {
	try {
		pubKey = b64toutf8(pubKey);
		let pub = KEYUTIL.getKey(pubKey);
		const setAlgName = algName !== null && algName !== void 0 ? algName : "RSAOAEP";
		let enc = KJUR.crypto.Cipher.encrypt(data, pub, setAlgName);
		return hextob64(enc);
	}
	catch (e) {
		return false;
	}
}
/**
 * rsa解密
 * @param data 密文 base64
 * @param privKey 私钥
 * @param algName
 * @return  明文
 * */
export function rsaDecrypt(data, privKey, algName) {
	try {
		privKey = b64toutf8(privKey);
		let value = b64tohex(data);
		let prv = KEYUTIL.getKey(privKey);
		const setAlgName = algName !== null && algName !== void 0 ? algName : "RSAOAEP";
		let dec = KJUR.crypto.Cipher.decrypt(value, prv, setAlgName);
		return dec;
	}
	catch (e) {
		return false;
	}
}
/**
 * rsa 签名
 * @param data 明文
 * @param privKey 私钥
 * @return  密文 base64
 * */
export function rsaSign(data, privKey) {
	try {
		privKey = b64toutf8(privKey);
		let signature = new KJUR.crypto.Signature({ alg: "SHA1withRSA", prvkeypem: privKey, });
		signature.updateString(data);
		// 签名返回hex
		let a = signature.sign();
		let sign = hextob64(a);
		return sign;
	}
	catch (e) {
		return false;
	}
}
/**
 * rsa 验签
 * @param data 明文
 * @param signStr 密文
 * @param pubKey 公钥
 * @return  true/false
 * */
export function rsaVerify(data, signStr, pubKey) {
	try {
		pubKey = b64toutf8(pubKey);
		let signatureVf = new KJUR.crypto.Signature({ alg: "SHA1withRSA", prvkeypem: pubKey, });
		signatureVf.updateString(data); //需要先对data编码
		// 验签入参是16进制字符串，注意转码
		return signatureVf.verify(b64tohex(signStr));
	}
	catch (e) {
		return false; // 出错和验签失败都是false
	}
}

