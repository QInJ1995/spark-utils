/**
 * @description: 对象数组根据对象某个属性去重
 * @param {*} array 对象数组
 * @param {*} property 对象属性
 * @return {*}
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
  