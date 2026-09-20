/**
 * 数值解析工厂（内部模块，移植自旧 src/helpers/helperCreateToNumber.js）
 *
 * 包装 parseFloat / parseInt 一类解析器：
 * - falsy 入参直接返回 0（不经解析器）；
 * - 解析结果为 NaN 返回 0。
 *
 * 该工厂产出的 toNumber / toInteger 是 number 模组的公共 API（见各自文件），
 * 此处不进 index.ts 具名导出。
 */

/**
 * 创建数值解析函数
 *
 * @param handle 底层解析器（入参已做 String 取串，与旧版 parseFloat(str) 的隐式取串一致）
 * @returns 解析函数：空值与不可解析值一律返回 0
 */
export function helperCreateToNumber(handle: (value: string) => number): (value: unknown) => number {
  return function (str: unknown): number {
    if (str) {
      const num = handle(String(str))
      if (!Number.isNaN(num)) {
        return num
      }
    }
    return 0
  }
}
