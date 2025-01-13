/*
 * @Author: QINJIN
 * @Date: 2024-02-29 13:43:57
 * @LastEditors: QINJIN
 * @LastEditTime: 2025-01-13 16:04:19
 * @FilePath: /spark-utils/src/other/onMountDialog.js
 * @Description: 挂载弹窗
 * @param {Object} options
 * @param {DOM} targetEl 挂载目标元素
 * @param {Object} dialog 挂载弹窗组件
 * @param {Object} propsData 传入propsData
 * @param {Object} ok 确定回调
 * @param {Object} close 关闭回调
 * @param {Object} callback 其他回调
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

async function onMountDialog (options = {}) {
  try {
    let Vue = import('vue');
    if(Vue) {
      let dialog 
      Vue = await Vue
      while (Vue && !Vue.extend) {
        Vue = Vue.default
      }
      Vue && (dialog = onMountVueDialog(Vue, options))
      return dialog
    }
  } catch (error) {
    throw(new Error('[spark-utils][onMountDialog]: 挂载异常！' + error)) 
  }
}


// vue挂载弹窗处理
async function onMountVueDialog (Vue, { targetEl = document.body, dialog, propsData = {}, ok, close, callback, i18n,}) {
  if(!targetEl || !dialog) return
  // 动态引入处理
  if (dialog instanceof Function) {
    dialog = (await dialog()).default
  }
  const Dialog = Vue.extend(dialog)
  dialog = new Dialog({
    i18n,
    propsData: {
      visible: true,
      ...propsData,
    },
  }).$mount()
  targetEl.appendChild(dialog.$el)
  // ok
  dialog.$on('ok', params => ok && ok(params))
  // close
  dialog.$once('close', (params) => {
    close && close(params)
    dialog.$destroy()
    dialog.$el.remove()
  })
  // callback
  dialog.$on('callback', params => callback && callback(params))
  return dialog
}

export default onMountDialog 