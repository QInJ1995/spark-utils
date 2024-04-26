/*
 * @Author: QINJIN
 * @Date: 2024-04-24 22:10:27
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-24 22:26:59
 * @FilePath: /spark-utils/src/crypto/index.js
 * @Description: 加密解密方法聚合
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import { aesEncrypt, aesDecrypt,} from './aes'
import { md5Sign, } from './md5'
import { rsaEncrypt, rsaDecrypt, rsaSign, rsaVerify, } from './rsa'
import { sm4Encrypt, sm4Decrypt, sm3Sign, sm2Encrypt, } from './sm'
import create64Key from './create64Key'

export default {
	aesEncrypt,
	aesDecrypt,
	md5Sign,
	rsaEncrypt,
	rsaDecrypt,
	rsaSign,
	rsaVerify,
	sm4Encrypt,
	sm4Decrypt,
	sm3Sign,
	sm2Encrypt,
	create64Key,
}
