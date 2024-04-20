import { isIE10 } from './isIE10'

const _receiveMessage = (e) => {
  if (!e) {
    return
  }
  const obj = e.data// 消息字符串结构:消息头 分隔字符串 消息体
  if (!obj.crossDomain) {
    return
  }
  // 如果是请求消息
  if (obj.call) {
    try {
      const callFun = eval(obj.callFun)// 消息请求的函数
      const arg = obj.arg
      if (typeof callFun != 'function') {
        return
      }// 请求的函数不存在
      const resultArg = callFun.call(callFun, arg)// 请求执行
      const callBack = obj.callBackFun// 是否反馈结果
      if (callBack) {
        window.sendMessage(e.source, callBack, resultArg)
      }
    } catch (e) {

    }
  }
}

/**
 * sendMessage主动发送广播消息
 * target string（iframe控件的ID）/object（iframe window,eq:如果是向父页面发送消息,则传window.parent）
 * callFun string 要访问目标iframe的方法名
 * arg 要访问目标iframe的方法的参数
 * callBackFun 消息反馈时调用的方法名
 */
const _sendMessage = (target, callFun, arg, callBackFun) => {
  try {
    let source
    if (typeof target == 'string') {
      source = document.getElementById(target)?.contentWindow || window.top.frames[target]
      if(source === undefined) throw '无法获取目标页面';
    } else if (typeof target == 'object' && target != null) {
      source = target
    } else {
      source = window.top
    }
    const callMessage = {}
    callMessage['callFun'] = callFun
    callMessage['arg'] = arg || ''
    callMessage['callBackFun'] = callBackFun
    // let msgStr = "call|cross-domain|" + JSON.stringify(callMessage);
    callMessage['crossDomain'] = true
    callMessage['call'] = true
    source.postMessage(callMessage, '*')
  } catch (e) {

  }
}

if (!window.receiveMessage) {
  window.receiveMessage = _receiveMessage
  if (window.attachEvent && !isIE10()) {
    window.attachEvent('onmessage', receiveMessage)
  } else {
    window.addEventListener('message', receiveMessage, true)
  }
}
if (!window.sendMessage) {
  window.sendMessage = _sendMessage
}
