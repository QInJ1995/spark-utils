/*
 * @Author: QINJIN
 * @Date: 2024-02-22 17:01:50
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-02-26 19:29:30
 * @FilePath: /spark-utils/src/parseUrlParams.js
 * @Description: 解析url地址参数
 * @param {String} 解析url地址
 * @return {*}
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */


function parseUrlParams (url) {
  if (!url) return {};
    const params = {};
    if (url.includes('?')) {
      const queryString = url.split('?')[1]
      const paramPairs = queryString.split('&')
  
      paramPairs.forEach(pair => {
        const [key, value] = pair.split('=')
        params[key] = decodeURIComponent(value)
      });
    }
  
    return params;
  }

  export default parseUrlParams