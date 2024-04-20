import arrayEach from '../array/arrayEach'
import each from '../basic/each'
import isFunction from '../basic/isFunction'
import SparkUtils from '../index'

function mixin () {
  arrayEach(arguments, function (methods) {
    each(methods, function (fn, name) {
      if(Object.hasOwn(SparkUtils, name)) throw new Error('SparkUtils has already existed method: ' + name)
      SparkUtils[name] = isFunction(fn) ? function () {
        var result = fn.apply(SparkUtils.$context, arguments)
        SparkUtils.$context = null
        return result
      } : fn
    })
  })
}

export default mixin