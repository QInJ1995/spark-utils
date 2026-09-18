/**
 * 国密 SM2 加密（vendored）
 *
 * 实现见相邻 sm2-1.0.js，与旧 src/crypto/sm/crypto/sm2-1.0.js 逐字节一致；
 * 输出为 C1C3C2/C1C2C3 排列的 16 进制密文（不含解密能力，与旧版一致）。
 *
 * 同构：实现已打守卫补丁（__su_nav/__su_win 垫片，差异见本目录 README.md），
 * 纯 Node 可直接 import，无需注入 window/navigator；浏览器行为不变。
 */

/** SM2 加密：data 为明文，publicKeyHex 为 16 进制公钥（04+x+y 或 x+y），cipherMode 0=C1C2C3、1=C1C3C2 */
declare function sm2Encrypt(
  data: string,
  publicKeyHex: string,
  cipherMode?: number | string,
): string

export default sm2Encrypt
