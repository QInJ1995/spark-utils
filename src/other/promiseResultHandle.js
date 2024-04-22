/*
 * @Author: QINJIN
 * @Date: 2024-02-29 15:21:20
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-22 20:11:12
 * @FilePath: /spark-utils/src/other/promiseResultHandle.js
 * @Description: promise对象结果处理
 * @param {Promise} options
 * @param {Object} promise promise对象
 * @param {String} resultKey 获取结果key
 * @param {Object} verifyConfig 校验配置
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import setupDefaults from '../constant/setup/setupDefaults'

async  function promiseResultHandle (options = {}) {
  if(!options.promise) return
  const resultKey = options.resultKey || setupDefaults.promiseResultConfig?.resultKey || 'data'
  const verifyConfig = options.verifyConfig || setupDefaults.promiseResultConfig?.verifyConfig || {}
    try {
      const result = await options.promise
      if (Object.entries(verifyConfig).reduce((pre, cur) => {
        if(result[cur[0]] !== cur[1]) pre = false
        return pre
      }, true)) {
        return Promise.resolve(resultKey.split('.').reduce((pre, cur) => {
          pre = pre[cur] 
          return pre
        }, result))
      } else {
        return Promise.reject(new Error('结果校验不通过!'))
      }
    } catch (error) {
      return Promise.reject(new Error('结果获取错误!'))
    }
  }

  export default promiseResultHandle 