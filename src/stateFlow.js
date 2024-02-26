/*
 * @Author: QINJIN
 * @Date: 2024-02-22 14:40:30
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-02-26 19:26:55
 * @FilePath: /spark-utils/src/stateFlow.js
 * @Description: 数据状态流
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

class StateFlow {
  constructor (k, v) {
    k && this.set(k, v)
  }

  // 设置函数，用于设置对象属性
  set (k, v) {
    if (!k) return
    if (k.includes('.')) {
      const sl = k.split('.')
      const target =  sl.slice(0, sl.length - 1).reduce((pre, cur) => {
        pre[cur] =  Object.hasOwn(pre, cur) ? pre[cur] : {}
        return pre[cur]
      }, this)
      target && (target[sl[sl.length - 1]] = v)
    } else {
      this[k] = Object.hasOwn(this, k) ? { ...this[k], ...v, } : v
    }
  }

  // 获取对象属性值
  get (k) {
    if (!k) return
    if (k.includes('.')) {
      const sl = k.split('.')
      const target = sl.slice(0, sl.length - 1).reduce((pre, cur) => {
        pre = pre[cur]
        return pre
      }, this)
      if(!target) return
      return target[sl[sl.length - 1]]
    } else {
      return this[k]
    }
  }

  // 触发函数
  action (k, ...v) {
    const fn = this.get(k)
    if (fn instanceof Function) {
      return fn(...v)
    }
  }

  // 销毁
  destroy (k) {
    if(k) {
      if (k.includes('.')) {
        const sl = k.split('.')
        const target = sl.slice(0, sl.length - 1).reduce((pre, cur) => {
          pre = pre[cur]
          return pre
        }, this)
        target && delete target[sl[sl.length - 1]]
      } else {
        this[k] && delete this[k]
      }
    } else {
      Object.keys(this).forEach(k => delete this[k]);
    }
  }
}

export default StateFlow
