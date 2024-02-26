/*
 * @Author: QINJIN
 * @Date: 2024-02-22 11:09:46
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-02-26 19:28:27
 * @FilePath: /spark-utils/src/getDataType.js
 * @Description: 获取数据类型
 * @param {any} target 目标值
 * @return {*}
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
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
