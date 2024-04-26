/*
 * @Author: QINJIN
 * @Date: 2024-02-22 16:53:56
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-24 22:08:37
 * @FilePath: /spark-utils/src/array/arrayDistinct.js
 * @Description: 数组去重
 * @param {*} array 对象数组或者平常的数组
 * @param {*} property 对象属性(对象数组必填)
 * @return {*} 
 * Copyright (c) 2024 by QINJIN All Rights Reserved. 
 */

function arrayDistinct (array, property) {
	const unique = Array.from(array.reduce((pre, cur) => {
		const value = (cur instanceof Object) && cur[property] ? cur[property] : cur
		if (!pre.has(value)) {
			pre.set(value, cur)
		}
		return pre;
	}, new Map()).values())
	return unique
}

export default arrayDistinct;
  