/**
 * crypto 域测试（M6：行为锁定，node 环境）
 *
 * 覆盖：md5/aes/sm3 标准向量或独立参考值（node:crypto 交叉验证）、
 * aes/sm4 加解密往返与错误路径（CryptoError 错误码）、rsa 固定密钥对的
 * sign/verify 往返与篡改、sm2 输出格式（vendored 实现仅有加密）、create64Key 长度/字符域。
 *
 * 已知事实（见 src/crypto/sm4 注释与 MIGRATION）：vendored SM4 与 GB/T 32907
 * 标准向量不一致，此处 KAT 为「实现锁定值」（与旧实现逐字节一致），非国标向量。
 *
 * vendored sm2-1.0.js 已打同构守卫补丁（__su_nav/__su_win 垫片，见
 * sm-vendor/README.md）：纯 Node 无需注入 window/navigator 即可 import。
 */
import { describe, it, expect, vi } from 'vitest'

import {
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
  CryptoError,
} from '../../src/crypto'

/** 孤立代理项（encodeURIComponent 对其抛 URIError，是最稳定的错误路径触发器） */
const LONE_SURROGATE = String.fromCharCode(0xd800)

/** 1024 位固定测试密钥对（jsrsasign 生成后固化，仅测试用） */
const RSA_PUB_PEM = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVipWXTVrVHSsmyZMeOT6qHKx2
Aas+YpZ8eSlYG9/HqEc+vfwz2FnAo9PcmJ4FdTATWbdzEroOPGGBp6NCoLYgBnNG
9rnTjG0HnEmK7iEM0xtmjuDsFdV5+J1Notw6FaC5H/uAB5tKFk6t/E3bPgc46hJk
nlb1G+y3W49fPp7xAwIDAQAB
-----END PUBLIC KEY-----`
const RSA_PRV_PEM = `-----BEGIN PRIVATE KEY-----
MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAJWKlZdNWtUdKybJ
kx45PqocrHYBqz5ilnx5KVgb38eoRz69/DPYWcCj09yYngV1MBNZt3MSug48YYGn
o0KgtiAGc0b2udOMbQecSYruIQzTG2aO4OwV1Xn4nU2i3DoVoLkf+4AHm0oWTq38
Tds+BzjqEmSeVvUb7Ldbj18+nvEDAgMBAAECgYEAlCnD/y34cjC9QWf06LwlF1zj
juQma+A4Y8mUKiUr+mEDfem0yRVyD8kCL43S+2tZn8KDXXNPfq1amqCixHABIXvh
NBzr5ZwFHRtwX3KOOdGkRIbInwFiuLI8tS02KpQLgh5UiXka4gfRw8OyhSJ/IRya
qFiHtQx/dpqd8j3JthkCQQDwguLEpQyFU+Mv3rbYw/AOC7VytaEI4Ur8wW/6daBF
hKWUrfcPIpMlM3KviMyLZNdFYZb4fA+9+Kz0KTMwyni3AkEAnyvzfn2/wQxrU+CL
eWgWPtNq9+a3u/KmSetUq9BL/JS9mgeRXJgx9Sn+fRGKBBb7r800mSny/tmD0lB1
DAdGFQJBAMLJ3otQ+UEKXdepUwFgP43AoeYTgCbHAIqQx/ZbScDD26787jlN0Uqx
zlKoQrEqrMa+cR0yrTU4sCrXK2R6tyUCQHIziY9uz57Ft1fF2qwvxw4qiCv3SEo8
LZ0JkIV5fJtraKHT3jKOLAHXsHSxmdGXX9thouRlmafKDm9eNKx9p4UCQQCtPZ8W
NSdJo1gbzA5F4c9NMybXTH9Jyfn8ruv969kGlD/swpxOFDOMaP6bDLQMeckAI9tD
CMrpmzgHG4YVPp4v
-----END PRIVATE KEY-----`

/** RSA 密钥传参约定：base64(PEM 文本) */
const rsaPubKey = (pem: string): string => Buffer.from(pem, 'utf8').toString('base64')
const rsaPrvKey = (pem: string): string => Buffer.from(pem, 'utf8').toString('base64')

/** SM4 固定向量（实现锁定值，见文件头说明） */
const SM4_KEY_B64 = Buffer.from('0123456789abcdeffedcba9876543210', 'hex').toString('base64')
const SM4_IV_B64 = Buffer.alloc(16, 0).toString('base64')
const SM4_KAT_PLAIN = '\x01\x23\x45\x67\x89\xab\xcd\xef\xfe\xdc\xba\x98\x76\x54\x32\x10'
const SM4_KAT_CIPHER = '1QNGuvw3SW8RiU4rPi9EYmE+60NXiWAnOhl7rM+EKcY='

/** SM2 固定公钥（sm2p256v1 曲线上的有效点，04+x+y 的 base64） */
const SM2_PUB_B64 =
  'BJ2sQm5A6e/BA/wa8N5r2/V8PD/mDAabeeWkbhBnA1OY++BYGAVGXTxHWJLoNOa4Yicbp0g1MVPeRnKEqjMEfyE='

/** 断言 fn 抛 CryptoError 且错误码为 code */
function expectCryptoError(fn: () => unknown, code: string): void {
  let caught: unknown
  try {
    fn()
  } catch (e) {
    caught = e
  }
  expect(caught).toBeInstanceOf(CryptoError)
  const err = caught as CryptoError
  expect(err.name).toBe('CryptoError')
  expect(err.code).toBe(code)
}

describe('CryptoError', () => {
  it('是 Error 子类，name 为 CryptoError，携带错误码', () => {
    const err = new CryptoError('ENCRYPT_FAILED', 'boom')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('CryptoError')
    expect(err.code).toBe('ENCRYPT_FAILED')
    expect(err.message).toBe('boom')
  })
})

describe('md5Sign', () => {
  it('标准向量：abc / 空串 / 快速棕狐句子', () => {
    expect(md5Sign('abc')).toBe('900150983cd24fb0d6963f7d28e17f72')
    expect(md5Sign('')).toBe('d41d8cd98f00b204e9800998ecf8427e')
    expect(md5Sign('The quick brown fox jumps over the lazy dog')).toBe(
      '9e107d9d372bb6826bd81d3542a419d6',
    )
  })

  it('多字节输入（UTF-8 中文）与 node:crypto 一致', () => {
    expect(md5Sign('中文')).toBe('a7bac2239fcdcb3a067903d8077c4a07')
  })

  it('孤立代理项抛 CryptoError(MD5_FAILED)，不再返回 false', () => {
    expectCryptoError(() => md5Sign(LONE_SURROGATE), 'MD5_FAILED')
  })
})

describe('aes', () => {
  const key16 = '1234567890abcdef'
  const iv16 = '0102030405060708'
  const key32 = '0123456789abcdef0123456789abcdef'

  it('128 位密钥密文与 node:crypto(aes-128-cbc) 独立参考值一致', () => {
    expect(aesEncrypt('hello spark-utils', key16, iv16)).toBe(
      '8avVfVk0AV9ecCMAidjK1PgnE/JDK9RZZYVLcBJyGWE=',
    )
  })

  it('256 位密钥 + 中文明文加解密往返', () => {
    const enc = aesEncrypt('中文加密测试', key32, iv16)
    expect(enc).toBe('Z6EI6sjzInqimmaXjkMiNbY0ZzIRqmbSy7ThN4G9lUs=')
    expect(aesDecrypt(enc, key32, iv16)).toBe('中文加密测试')
  })

  it('明文跨多个分组块时加解密往返', () => {
    const plain = 'x'.repeat(37) + '尾部'
    expect(aesDecrypt(aesEncrypt(plain, key16, iv16), key16, iv16)).toBe(plain)
  })

  it('长度合法但错误的密钥解出乱码且不抛错（CBC 无认证，与旧版一致）', () => {
    const enc = aesEncrypt('hello spark-utils', key16, iv16)
    const wrong = aesDecrypt(enc, 'abcdefabcdefabcd', iv16)
    expect(wrong).not.toBe('hello spark-utils')
  })

  it('密钥长度非法（15 字节）抛 CryptoError(INVALID_KEY)', () => {
    expectCryptoError(() => aesEncrypt('data', '1234567890abcde', iv16), 'INVALID_KEY')
    expectCryptoError(() => aesDecrypt('data', '1234567890abcde', iv16), 'INVALID_KEY')
  })

  it('初始向量长度非法抛 CryptoError(INVALID_KEY)', () => {
    expectCryptoError(() => aesEncrypt('data', key16, '0102'), 'INVALID_KEY')
  })

  it('明文含孤立代理项抛 CryptoError(ENCRYPT_FAILED)', () => {
    expectCryptoError(() => aesEncrypt(LONE_SURROGATE, key16, iv16), 'ENCRYPT_FAILED')
  })
})

describe('sm4', () => {
  it('实现锁定向量：标准测试密钥 + 全零 iv 的 CBC 密文', () => {
    expect(sm4Encrypt(SM4_KAT_PLAIN, SM4_KEY_B64, SM4_IV_B64)).toBe(SM4_KAT_CIPHER)
  })

  it('加解密往返（ascii / 中文 / 恰好一个分组块）', () => {
    for (const plain of ['abc', '中文sm4测试', '0123456789abcdef']) {
      const enc = sm4Encrypt(plain, SM4_KEY_B64, SM4_IV_B64)
      expect(sm4Decrypt(enc, SM4_KEY_B64, SM4_IV_B64)).toBe(plain)
    }
  })

  it('坏密钥（非法 base64）抛 CryptoError(INVALID_KEY)，不再返回 false', () => {
    // 2.0 收紧：畸形密钥改在解析期显式拒绝（与 aes 一致），不再进入加密路径
    expectCryptoError(() => sm4Encrypt('abc', 'bad!!key', SM4_IV_B64), 'INVALID_KEY')
    expectCryptoError(() => sm4Decrypt('irrelevant', 'bad!!key', SM4_IV_B64), 'INVALID_KEY')
  })

  it('密钥/初始向量字节长度非 16 抛 CryptoError(INVALID_KEY)', () => {
    const key15 = Buffer.alloc(15, 1).toString('base64')
    const iv8 = Buffer.alloc(8, 1).toString('base64')
    expectCryptoError(() => sm4Encrypt('abc', key15, SM4_IV_B64), 'INVALID_KEY')
    expectCryptoError(() => sm4Encrypt('abc', SM4_KEY_B64, iv8), 'INVALID_KEY')
    expectCryptoError(() => sm4Decrypt('irrelevant', key15, iv8), 'INVALID_KEY')
  })

  it('空明文抛 CryptoError(ENCRYPT_FAILED)（vendored encrypt_cbc 对空输入返回 null，旧版吞错为 false）', () => {
    expectCryptoError(() => sm4Encrypt('', SM4_KEY_B64, SM4_IV_B64), 'ENCRYPT_FAILED')
  })

  it('密文非法（非 base64 / 长度非 16 的倍数）抛 CryptoError(DECRYPT_FAILED)', () => {
    expectCryptoError(() => sm4Decrypt('@@@notb64@@@', SM4_KEY_B64, SM4_IV_B64), 'DECRYPT_FAILED')
    expectCryptoError(
      () => sm4Decrypt(Buffer.from('12345678', 'utf8').toString('base64'), SM4_KEY_B64, SM4_IV_B64),
      'DECRYPT_FAILED',
    )
  })

  it('明文含孤立代理项抛 CryptoError(ENCRYPT_FAILED)', () => {
    expectCryptoError(() => sm4Encrypt(LONE_SURROGATE, SM4_KEY_B64, SM4_IV_B64), 'ENCRYPT_FAILED')
  })
})

describe('sm3Sign', () => {
  it('国标向量：abc / 空串（输出为大写 16 进制）', () => {
    expect(sm3Sign('abc')).toBe('66C7F0F462EEEDD9D1F2D46BDC10E4E24167C4875CF2F7A2297DA02B8F4BA8E0')
    expect(sm3Sign('')).toBe('1AB21D8355CFA17F8E61194831E81A8F22BEC8C728FEFB747ED035EB5082AA2B')
  })

  it('确定性摘要且不同输入产出不同', () => {
    const long = 'spark-utils'.repeat(20)
    expect(sm3Sign(long)).toBe(sm3Sign(long))
    expect(sm3Sign('a')).not.toBe(sm3Sign('b'))
  })

  it('明文含孤立代理项抛 CryptoError(SIGN_FAILED)', () => {
    expectCryptoError(() => sm3Sign(LONE_SURROGATE), 'SIGN_FAILED')
  })
})

describe('rsa', () => {
  const pub = rsaPubKey(RSA_PUB_PEM)
  const prv = rsaPrvKey(RSA_PRV_PEM)

  it('加解密往返（RSAOAEP 默认算法）', () => {
    const enc = rsaEncrypt('rsa-roundtrip', pub)
    expect(typeof enc).toBe('string')
    expect(rsaDecrypt(enc, prv)).toBe('rsa-roundtrip')
  })

  it('签名返回 base64，长度与 1024 位密钥一致（128 字节 => 172 字符）', () => {
    const sig = rsaSign('sign-me', prv)
    expect(sig).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
    expect(sig.length).toBe(172)
  })

  it('验签通过；篡改明文后验签返回 false（不抛错）', () => {
    const sig = rsaSign('sign-me', prv)
    expect(rsaVerify('sign-me', sig, pub)).toBe(true)
    expect(rsaVerify('sign-meX', sig, pub)).toBe(false)
  })

  it('坏公钥加密抛 CryptoError(ENCRYPT_FAILED)，不再返回 false', () => {
    expectCryptoError(() => rsaEncrypt('x', Buffer.from('not-pem').toString('base64')), 'ENCRYPT_FAILED')
  })

  it('坏私钥解密抛 CryptoError(DECRYPT_FAILED)', () => {
    const enc = rsaEncrypt('data', pub)
    expectCryptoError(() => rsaDecrypt(enc, Buffer.from('not-pem').toString('base64')), 'DECRYPT_FAILED')
  })

  it('坏公钥验签抛 CryptoError(VERIFY_FAILED)（旧版此场景也返回 false）', () => {
    const sig = rsaSign('sign-me', prv)
    expectCryptoError(() => rsaVerify('sign-me', sig, Buffer.from('not-pem').toString('base64')), 'VERIFY_FAILED')
  })
})

describe('create64Key', () => {
  it('默认返回指定长度、仅含大小写字母与数字的字符串', () => {
    const key = create64Key(32)
    expect(key).toMatch(/^[0-9a-zA-Z]{32}$/)
    expect(create64Key(0)).toBe('')
  })

  it('flag 为真时返回可解回原字符域的 base64', () => {
    const encoded = create64Key(16, true)
    expect(encoded).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
    expect(Buffer.from(encoded, 'base64').toString('utf8')).toMatch(/^[0-9a-zA-Z]{16}$/)
  })

  it('两次调用产出不同随机串', () => {
    expect(create64Key(64)).not.toBe(create64Key(64))
  })

  it('2.0：随机源优先 CSPRNG（getRandomValues 被调用）', () => {
    const spy = vi.spyOn(globalThis.crypto, 'getRandomValues')
    create64Key(64)
    // 拒绝采样存在重抽可能，仅断言确实走了 CSPRNG 路径
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('sm2Encrypt', () => {
  it('输出为 base64，解码后首字节 0x04、长度 = 97 + 明文 UTF-8 字节数', () => {
    for (const plain of ['abc', '中文sm2']) {
      const enc = sm2Encrypt(plain, SM2_PUB_B64)
      const raw = Buffer.from(enc, 'base64')
      const utf8Bytes = Buffer.byteLength(plain, 'utf8')
      expect(raw[0]).toBe(0x04)
      expect(raw.length).toBe(97 + utf8Bytes)
    }
  })

  it('加密使用随机数：两次密文不同', () => {
    expect(sm2Encrypt('abc', SM2_PUB_B64)).not.toBe(sm2Encrypt('abc', SM2_PUB_B64))
  })

  it('明文含孤立代理项抛 CryptoError(ENCRYPT_FAILED)', () => {
    expectCryptoError(() => sm2Encrypt(LONE_SURROGATE, SM2_PUB_B64), 'ENCRYPT_FAILED')
  })
})
