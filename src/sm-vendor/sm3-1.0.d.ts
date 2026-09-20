/**
 * 国密 SM3 杂凑（vendored）
 *
 * 实现见相邻 sm3-1.0.js，与旧 src/crypto/sm/crypto/sm3-1.0.js 逐字节一致。
 */

/** SM3 摘要：流式 update / doFinal，输出 32 字节摘要数组 */
declare class SM3 {
  /**
   * 喂入一段数据（data 的 [pos, pos+len) 区间）
   * 数据很多时可分多次 update
   */
  update(data: readonly number[], pos: number, len: number): void
  /** 结束当前摘要计算并输出（实例可复用，内部自动复位） */
  doFinal(): number[]
}

export default SM3
