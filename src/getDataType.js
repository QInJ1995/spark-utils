/**
 * @description: 获取数据类型
 * @param {any} target 目标值
 * @return {*}
 */

function getDataType (target) {
  let type = typeof target; // 判断是否是复杂数据类型
  if (type === "object") {
    return Object.prototype.toString
      .call(target)
      .replace(/^\[object (\S+)\]$/, "$1")
      .toLowerCase()
  } else {
    // 基础数据类型直接返回
    return type
  }
}
//导出这个方法
export default getDataType
