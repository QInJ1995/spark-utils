/*
 * @Author: QINJIN
 * @Date: 2024-02-22 16:53:56
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-02-26 19:30:19
 * @FilePath: /spark-utils/src/uniqueObjects.js
 * @Description: 对象数组根据对象某个属性去重
 * @param {*} array 对象数组
 * @param {*} property 对象属性
 * @return {*} 
 * Copyright (c) 2024 by QINJIN All Rights Reserved. 
 */

function uniqueObjects (array, property) {
    const unique = Array.from(array.reduce((pre, cur) => {
      const value = cur[property]
      if (!pre.has(value)) {
        pre.set(value, cur)
      }
      return pre;
    }, new Map()).values())
    return unique
  }

  export default uniqueObjects;
  