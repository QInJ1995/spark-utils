import Hex from './crypto/utils/hex'
import SM4 from './crypto/sm4-1.0'
import SM3 from './crypto/sm3-1.0'
import SM2 from './crypto/sm2-1.0'
import { reBytesStrArr, getStrBytes, } from './crypto/utils/byteUtil'

/**
 * sm4加密
 * @param data 明文
 * @param keyStr 秘钥key base64
 * @param ivStr iv base64
 * @return  base64格式
 * */
export function sm4Encrypt (data, keyStr, ivStr) {
	try {
		let value = Hex.utf8StrToBytes(data) // uft-8=>编码=>byte
		let key = Hex.b64toBA(keyStr)
		let iv = Hex.b64toBA(ivStr)
		let sm4 = new SM4()
		// 入参全部为byte 返回的值为byte
		let rs = sm4.encrypt_cbc(key, iv, value)
		return Hex.BAtob64(rs)
	} catch (e) {
		return false
	}

}
/**
 * sm4 解密
 * @param data 密文
 * @param keyStr 秘钥key base64
 * @param ivStr iv base64
 * @return  明文
 * */
export function sm4Decrypt (data, keyStr, ivStr) {
	try {
		let value = Hex.b64toBA(data)
		let key = Hex.b64toBA(keyStr)
		let iv = Hex.b64toBA(ivStr)
		let sm4 = new SM4()
		let rs = sm4.decrypt_cbc(key, iv, value)
		return Hex.bytesToUtf8Str(rs)
	}catch (e) {
		return false
	}

}
/**
 * sm3签名
 * @param data 明文
 * @return  密文 Hex
 * */
export function sm3Sign (data) {
	try {
		let dataBy = Hex.utf8StrToBytes(data)
		let sm3 = new SM3()
		sm3.update(dataBy, 0, dataBy.length)// 数据很多的话，可以分多次update
		let sm3Hash = sm3.doFinal()// 得到的数据是个byte数组
		let rs = Hex.encode(sm3Hash, 0, sm3Hash.length)// 编码成16进制可见字符
		return rs
	}catch (e) {
		return false
	}

}
/**
 * sm2加密
 * @param data 明文
 * @param pubKey 公钥 base64
 * @return  密文 base64
 * */
export function sm2Encrypt (data, pubKey) {
	try {
		let pk=Hex.b64tohex(pubKey)
		// 获取加密过后的密文
		const rs = SM2(data, pk, 0);
		return Hex.hextob64(rs)
	}catch (e) {
		return false
	}



}
/**
 * sm2分组加密，通过最大字节数进行分组加密
 * 按自己长度分组，对每一组加密之后第一个字节存储每组的长度，然后拼接一起转成 base64
 * @param data 明文
 * @param pubKey 公钥 base64
 * @param groupBytesLen 分组加密的最大字节长度
 * @return  密文 base64
 * */
export function sm2GroupingEncrypt (data, pubKey,groupBytesLen) {
	try {
		let pk=Hex.b64tohex(pubKey)
		let resultPwd = []
		if(groupBytesLen) {
			const splitData = reBytesStrArr(data,groupBytesLen)
			let i = 0
			while (i<splitData.length) {
				const itemData = splitData[i]
				// 获取分组的加密过后的密文
				const rs = SM2(itemData, pk, 0);
				// 第一字节赋值为密文的长度
				const hex = Hex.decode(rs)
				hex[0] = hex.length
				// 连接
				resultPwd = resultPwd.concat(hex)
				i++
			}
		}
		return Hex.BAtob64(resultPwd)
	}catch (e) {
		return false
	}




}
/**
 * sm2解密
 * @param data 密文 base64
 * @param priKey 私钥 base64
 * @return  明文
 * */
function sm2Decrypt (data, priKey) {


}
