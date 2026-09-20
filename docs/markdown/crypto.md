# 加密

AES / MD5 / RSA 签名验签 / 国密系列，收敛在 `spark-utils/crypto` 子入口（10 个方法 + `CryptoError`）。`crypto-js` 与 `jsrsasign` 仅在此入口可达，不拖累主包体积。

```ts
import { aesEncrypt, aesDecrypt } from 'spark-utils/crypto'
```

::: tip 2.0 变更
- 调用方式由命名空间对象（旧：`import { crypto } from 'spark-utils'` 后 `crypto.aesEncrypt(...)`）改为**具名导入**；
- 错误处理统一为抛出类型化 `CryptoError`（不再吞错返回 `false` 等假值），失败场景可按 `instanceof` / 错误信息分支处理；
- `md5Sign` 统一由 crypto-js 实现（输出小写十六进制摘要）。
:::

## AES

### aesEncrypt / aesDecrypt

`aesEncrypt(data, keyStr, ivStr)` 加密、`aesDecrypt(data, keyStr, ivStr)` 解密（Base64 密文形态）。`keyStr` / `ivStr` 均必填（UTF-8 字节长度须为 16，不合法抛 `CryptoError('INVALID_KEY')`）。

```ts
import { aesEncrypt, aesDecrypt } from 'spark-utils/crypto'

const cipher = aesEncrypt('你好，坤坤', 'abcdefghijkl', 'opqrstuvwxyz')
// '8GB6KdX6YTD2PJI7Iohp4A=='

aesDecrypt(cipher, 'abcdefghijkl', 'opqrstuvwxyz')  // '你好，坤坤'
```

## MD5

### md5Sign

`md5Sign(data: string): string`，返回 32 位小写十六进制摘要（crypto-js 实现）。

```ts
import { md5Sign } from 'spark-utils/crypto'

md5Sign('你好，坤坤')  // 'b3e4a01478a0855984731f6bf4a4a11b'
```

## RSA

### rsaEncrypt / rsaDecrypt（已移除）

2.0 不再提供 RSA 加解密：依赖 jsrsasign 升至 11.x 后，其因 Marvin Attack（CVE-2024-21484，RSA 解密时序侧信道，纯 JS 无法常数时间实现）彻底移除了该原语。请改用平台原生 WebCrypto（Node ≥18 与现代浏览器写法一致，注意为异步）：

```ts
const subtle = globalThis.crypto.subtle

// 旧密钥形制为 base64(PEM 文本)：剥掉 PEM 头尾行后，剩余 base64 即 DER（公钥 SPKI / 私钥 PKCS8）
const pub = await subtle.importKey('spki', derBytes, { name: 'RSA-OAEP' }, false, ['encrypt'])
const cipher = await subtle.encrypt({ name: 'RSA-OAEP' }, pub, new TextEncoder().encode('Hello World'))
// 解密方向：importKey('pkcs8', ...) + subtle.decrypt
```

### rsaSign / rsaVerify

`rsaSign(data, priKey)` 私钥签名、`rsaVerify(data, sign, pubKey)` 公钥验签（返回 `boolean`）。

```ts
import { rsaSign, rsaVerify } from 'spark-utils/crypto'

const sign = rsaSign('Hello World', priKey)
rsaVerify('Hello World', sign, pubKey)  // true
```

## 国密（SM 系列）

### sm4Encrypt / sm4Decrypt

`sm4Encrypt(data, key, ivStr)` 加密、`sm4Decrypt(data, key, ivStr)` 解密。`key` / `ivStr` 均必填（base64 解码后字节长度须为 16，不合法抛 `CryptoError('INVALID_KEY')`）。

```ts
import { sm4Encrypt, sm4Decrypt } from 'spark-utils/crypto'

const key = 'xi68urbYpXnSlj2RLxHsug=='
const iv = 'xi68urbYpXnSlj2RLxHsug=='

const cipher = sm4Encrypt('Hello World', key, iv)  // 'QZV35vkbYsAPS/0hZBHJXA=='
sm4Decrypt(cipher, key, iv)  // 'Hello World'
```

### sm3Sign

`sm3Sign(data: string): string`，SM3 摘要（大写十六进制）。

```ts
import { sm3Sign } from 'spark-utils/crypto'

sm3Sign('你好')
// '78E5C78C5322CA174089E58DC7790ACF8CE9D542BEE6AE4A5A0797D5E356BE61'
```

### sm2Encrypt

`sm2Encrypt(data, pubKey)`，SM2 公钥加密。

```ts
import { sm2Encrypt } from 'spark-utils/crypto'

const pubKey =
  'BDs0bYE6n6+0IAhLeWqdpHRou1hnlLZZ8OVvHFTjbWYWj1gysKYKw+IBCOgZ5UOsCNdAOP0aTzWuuA1XWhvq19E='

const cipher = sm2Encrypt('Hello World', pubKey)
```

## create64Key

随机生成 64 字符密钥串。

`create64Key(length: number, flag?: boolean): string`（`length <= 0` 返回空串；`flag` 为真时对结果做 `encodeURIComponent` + `btoa` 编码返回）

```ts
import { create64Key } from 'spark-utils/crypto'

create64Key(10)         // 10 位随机串
create64Key(16, true)   // 16 位并以 base64 输出
```

## 错误处理（CryptoError）

加密 / 解密 / 签名失败时统一抛出类型化 `CryptoError`（不再静默返回 `false` 等假值），原始异常保留在 `cause` 上，调用方按需捕获：

```ts
import { aesDecrypt, CryptoError } from 'spark-utils/crypto'

try {
  aesDecrypt(cipher, 'wrong-key', 'opqrstuvwxyz')
} catch (error) {
  if (error instanceof CryptoError && error.code === 'INVALID_KEY') {
    console.error('密钥不合法：', error.message)
  }
}
```

错误码一览（`error.code`）：

| code | 触发方法 | 含义 |
| --- | --- | --- |
| `ENCRYPT_FAILED` | `aesEncrypt` / `sm4Encrypt` / `sm2Encrypt` | 加密失败 |
| `DECRYPT_FAILED` | `aesDecrypt` / `sm4Decrypt` | 解密失败 |
| `SIGN_FAILED` | `rsaSign` / `sm3Sign` | 签名 / 摘要失败 |
| `VERIFY_FAILED` | `rsaVerify` | 验签处理异常（验签不通过仍返回 `false`，不抛错） |
| `MD5_FAILED` | `md5Sign` | MD5 计算失败（兜底错误码） |
| `INVALID_KEY` | `aesEncrypt` / `aesDecrypt` / `sm4Encrypt` / `sm4Decrypt` | 密钥 / 初始向量长度或编码不合法 |
