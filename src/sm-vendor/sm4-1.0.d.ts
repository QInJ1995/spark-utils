/**
 * 国密 SM4 分组密码（vendored）
 *
 * 实现见相邻 sm4-1.0.js，与旧 src/crypto/sm/crypto/sm4-1.0.js 逐字节一致。
 * 注意：经实测该 vendored 实现与 GB/T 32907 标准向量输出不一致
 * （旧版线上数据即由此实现产生），为保证历史密文可解而原样保留。
 */

/** SM4：入参/出参均为 byte 数组（key/iv 16 字节），内部 PKCS7 填充 */
declare class SM4 {
  /** CBC 加密：data 任意长度，返回含填充的密文 byte 数组 */
  encrypt_cbc(key: readonly number[], iv: readonly number[], data: readonly number[]): number[]
  /** CBC 解密：返回去除填充后的明文 byte 数组 */
  decrypt_cbc(key: readonly number[], iv: readonly number[], data: readonly number[]): number[]
}

export default SM4
