/**
 * crypto-js / jsrsasign 的最小结构类型垫片（主程序侧）
 *
 * 两库均未随包提供 .d.ts，也未安装 @types；
 * 仅覆盖 spark-utils/crypto 实际用到的 API，按需扩充。
 * 本文件经 src/crypto/index.ts 的 /// reference 引入，
 * 使环境声明随模块图进入任何包含本域的程序。
 */

declare module 'crypto-js' {
  /** crypto-js 字节数组抽象（sigBytes 为 UTF-8 字节长度） */
  export interface WordArray {
    readonly sigBytes: number
    toString(): string
  }

  /** 编码器静态对象（Utf8 等） */
  export interface Encoder {
    parse(text: string): WordArray
    stringify(wordArray: WordArray): string
  }

  /** 分组密码配置项 */
  export interface CipherCfg {
    iv?: WordArray
    mode?: unknown
    padding?: unknown
  }

  /** 加密结果（toString 默认输出 base64） */
  export interface CipherParams {
    toString(): string
  }

  export interface CipherStatic {
    encrypt(message: string, key: WordArray, cfg?: CipherCfg): CipherParams
    decrypt(ciphertext: string, key: WordArray, cfg?: CipherCfg): WordArray
  }

  const CryptoJS: {
    readonly enc: { readonly Utf8: Encoder }
    readonly AES: CipherStatic
    readonly MD5(message: string): WordArray
    readonly mode: { readonly CBC: unknown }
    readonly pad: { readonly Pkcs7: unknown }
  }

  export default CryptoJS
}

declare module 'jsrsasign' {
  /** RSA 密钥对象（公钥或私钥，内部结构不透明） */
  export interface RSAKeyObject {
    readonly isPublic?: boolean
    readonly isPrivate?: boolean
  }

  /** KJUR.crypto.Signature 构造参数 */
  export interface SignatureOptions {
    alg: string
    prov?: string
    /** PEM 文本（验签时与旧实现一致：公钥 PEM 也经此参数传入） */
    prvkeypem?: string
  }

  /** 签名/验签实例 */
  export interface Signature {
    /** 注入密钥对象（与 prvkeypem 路径逐位等价；公钥依 isPublic 自动分派到验签状态） */
    init(key: RSAKeyObject | string): void
    updateString(data: string): void
    sign(): string
    verify(hexSignature: string): boolean
  }

  export const KEYUTIL: {
    /** 解析 PEM/JWK 文本为密钥对象 */
    getKey(pemString: string): RSAKeyObject
  }

  export const KJUR: {
    readonly crypto: {
      readonly Cipher: {
        /** 返回 16 进制密文 */
        encrypt(message: string, key: RSAKeyObject, algName?: string): string
        /** 入参 16 进制密文，返回明文 */
        decrypt(hexCipher: string, key: RSAKeyObject, algName?: string): string
      }
      readonly Signature: new (options: SignatureOptions) => Signature
    }
  }

  /** 16 进制 => base64 */
  export function hextob64(hex: string): string
  /** base64 => 16 进制（非法字符被跳过） */
  export function b64tohex(b64: string): string
  /** base64（其内容为 PEM 等文本）=> UTF-8 字符串 */
  export function b64toutf8(b64: string): string
  /** base64 => byte 数组 */
  export function b64toBA(b64: string): number[]
  /** byte 数组 => 16 进制 */
  export function BAtohex(byteArray: readonly number[]): string
}
