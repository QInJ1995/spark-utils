import isFunction from '../basic/isFunction'
import isArray from '../basic/isArray'
import each from '../basic/each'
import findIndexOf from '../array/findIndexOf'

function helperCreatePickOmit (case1, case2) {
  return function (obj, callback) {
    let item, index
    const rest = {}
    const result = []
    const context = this
    const args = arguments
    const len = args.length
    if (!isFunction(callback)) {
      for (index = 1; index < len; index++) {
        item = args[index]
        result.push.apply(result, isArray(item) ? item : [item])
      }
      callback = 0
    }
    each(obj, function (val, key) {
      if ((callback ? callback.call(context, val, key, obj) : findIndexOf(result, function (name) {
        return name === key
      }) > -1) ? case1 : case2) {
        rest[key] = val
      }
    })
    return rest
  }
}

export default helperCreatePickOmit
