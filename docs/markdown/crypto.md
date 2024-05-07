# 加密工具

## aesEncrypt

AES加密

### 参数

`aesEncrypt(data, keyStr, ivStr)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待加密的数据 | - |
| keyStr | string | 是 | 密钥 | - |
| ivStr | string | 否 | 初始化向量 | - |

### 返回值

`string`

### 示例

```js

import { crypto } from 'spark-utils';

crypto.aesEncrypt('你好，坤坤', 'abcdefghijkl', 'opqrstuvwxyz') // '8GB6KdX6YTD2PJI7Iohp4A=='

```

## aesDecrypt

AES解密

### 参数

`aesDecrypt(data, keyStr, ivStr)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待解密的数据 | - |
| keyStr | string | 是 | 密钥 | - |
| ivStr | string | 否 | 初始化向量 | - |

### 返回值

`string`

### 示例

```js

import { crypto } from 'spark-utils';

crypto.aesDecrypt('8GB6KdX6YTD2PJI7Iohp4A==', 'abcdefghijkl', 'opqrstuvwxyz') // '你好，坤坤'

```

## md5Sign

md5Sign加密

### 参数

`md5(data)`

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待加密的数据 | - |

### 返回值

`string`

### 示例

```js

import { crypto } from 'spark-utils';

crypto.md5Sign('你好，坤坤') // 'b3e4a01478a0855984731f6bf4a4a11b'

```

## rsaEncrypt

RSA加密

`rsaEncrypt(data, pubKey)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待加密的数据 | - |
| pubKey | string | 是 | 公钥 | - |

### 返回值

`string`

### 示例

```js

import { crypto } from 'spark-utils';
let pk1="LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FDSkprUERyV2pRUG1JTnhMZzJpeWtYZU82RwpYTk8wNXZyMjdkcExUeW9KWWgrYjQxQVVLWXprVk5tZ0pTV2lHaktvQVc1cnVMdCtGaC9sNy9RanZmR2Z2OVY3CkZ1STREU0pCSzdQZHI0alQ1aGNhb1hHYkdiUDlGL1dneUdMMGYxV05sbnpSOUEzNTRuSlo3Nms3aHpvMHYwbjgKZzRockxJOWMrTGZTWmNNc1JRSURBUUFCCi0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo="
let rsaData = crypto.rsaEncrypt("Hello World", pk1)
console.log(rsaData)

```

## rsaDecrypt

RSA解密

`rsaDecrypt(data, priKey)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待解密的数据 | - |
| priKey | string | 是 | 私钥 | - |

### 返回值

`string`

### 示例

```js
    
import { crypto } from 'spark-utils';

 let prv1="LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUNkZ0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQW1Bd2dnSmNBZ0VBQW9HQkFJa21ROE90YU5BK1lnM0UKdURhTEtSZDQ3b1pjMDdUbSt2YnQya3RQS2dsaUg1dmpVQlFwak9SVTJhQWxKYUlhTXFnQmJtdTR1MzRXSCtYdgo5Q085OForLzFYc1c0amdOSWtFcnM5MnZpTlBtRnhxaGNac1pzLzBYOWFESVl2Ui9WWTJXZk5IMERmbmljbG52CnFUdUhPalMvU2Z5RGlHc3NqMXo0dDlKbHd5eEZBZ01CQUFFQ2dZQlA2R09ERnY0Q2x0WTZmMnQxSEErTkJZQ3oKK0ZIQkRQTWIrK2s4QjV2T2E4Vk81bG81NVJ1WnpYWWV3SVgwdEo3ZkZEWnB2UEJBdmxOSGZVOFpwQW1xelJTKwpTdzFPT2hxdUFaTmhWMmRycDhxcW8wc0tDUytqSlRCUHBtUVdBTFdYS3dKT29JRWhGdjg0anFHb3VGRHZtRjRvClhCNXV1M3NpZHkxdTA3bXM0UUpCQVA5Q3dhNWRGMndJVlpneXNxZWI4R0g0RUc2d1JvSHBCUHE5cm5jWmhSNnUKekE4dWNpREdYMVA3SzZmRHNDREx0NndBbXM0TjgzM0tLNCt6Q2F1dVdyTUNRUUNKaS9HUXhwdDFIVXhwbXpjVQpoa093WWFOa3dqVGR4bjBMQTFvT2JyeFB5VEREZVlvZjMwWGRyckl2REh6bnljYW5ZMVlPQ2JVaXQzbm94eXU2CnVMa25Ba0VBL2FMM2tLb3ZlOGxNUTg4Y2RpOGN6RHdSRit0UUpBWEdUTi90VzZxZis3ejBScUdBQmRFWEovdUwKaFVlTTJ3bVJsL2VCMnYxQjFOdnVMUHRad0oyZXdRSkFZaWcxVnJ6MUdjbXp5eldTUkJwZzJkR0QyaGJoeFZhdAp5NXN6dkZMNEhmUVUwWnE5b0dza244UFlzc3kxb25BVFRVY05sVzBHRCtWaG9XWHBaaElIUndKQUI5amFucFdXCk4ySTlYS3lWQlNQajYvWlpKcVZvcjMwVXpiVTZZYm1pOEhiS1FZdktLaEF3N0Z1MW80Zmh3cVAwUEdnNlJtZkoKdDc1bzdHMUtiMnlTVlE9PQotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg=="
crypto.rsaDecrypt(rsaData, prv1) // Hello World

```

## rsaSign

RSA签名

`rsaSign(data, priKey)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待签名的数据 | - |
| priKey | string | 是 | 私钥 | - |

### 返回值

`string`

### 示例

```js

import { crypto } from 'spark-utils';

let data = crypto.rsaSign("Hello World", prv1)

```

## rsaVerify

RSA验签

`rsaVerify(data, sign, pubKey)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待验签的数据 | - |
| sign | string | 是 | 签名 | - |
| pubKey | string | 是 | 公钥 | - |

### 返回值

`boolean`

### 示例

```js

import { crypto } from 'spark-utils';

let data = crypto.rsaVerify("Hello World", sign, pubKey)

```

## sm4Encrypt

sm4加密

`sm4Encrypt(data, key, ivStr)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待加密的数据 | - |
| key | string | 是 | 密钥 | - |
| ivStr | string | 否 | 偏移量 | - |

### 返回值

`string`

### 示例

```js

import { crypto } from 'spark-utils';

let key = 'xi68urbYpXnSlj2RLxHsug=='
let iv = 'xi68urbYpXnSlj2RLxHsug=='
let pubKey = "BDs0bYE6n6+0IAhLeWqdpHRou1hnlLZZ8OVvHFTjbWYWj1gysKYKw+IBCOgZ5UOsCNdAOP0aTzWuuA1XWhvq19E="
let value = 'Hello World'
let sm4Data = crypto.sm4Encrypt(value, key, iv) // QZV35vkbYsAPS/0hZBHJXA==

```

## sm4Decrypt

sm4解密

`sm4Decrypt(data, key, ivStr)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待解密的数据 | - |
| key | string | 是 | 密钥 | - |
| ivStr | string | 否 | 偏移量 | - |

### 返回值

`string`

### 示例

```js

import { crypto } from 'spark-utils';

crypto.sm4Decrypt(sm4Data, key, iv) // Hello World

```

## sm3Sign

sm3签名

`sm3Sign(data)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待签名的数据 | - |

### 返回值

`string`

### 示例

```js

import { crypto } from 'spark-utils';

crypto.sm3Sign('你好') // 78E5C78C5322CA174089E58DC7790ACF8CE9D542BEE6AE4A5A0797D5E356BE61

```

## sm2Encrypt

sm2加密

`sm2Encrypt(data, pubKey)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| data | string | 是 | 待加密的数据 | - |
| pubKey | string | 是 | 公钥 | - |

### 返回值

`string`

### 示例

```js

import { crypto } from 'spark-utils';

crypto.sm2Encrypt(value, pubKey) 

```

## create64Key

随机产生create64Key

`create64Key(length, isBase64)`

### 参数

| 参数名 | 类型 | 必填 | 说明 | 默认值 |
| --- | --- | --- | --- | --- |
| length | number | 否 | 密钥长度 | 0 |
| isBase64 | string | 否 | 是否转为base64格式 | false |

### 返回值

`string`

### 示例

```js

import { crypto } from 'spark-utils';

crypto.create64Key(10)

```
