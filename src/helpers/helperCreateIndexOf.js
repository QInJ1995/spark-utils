import isArray from '../basic/isArray'
import isString from '../basic/isString'
import hasOwnProp from '../basic/hasOwnProp'

function helperCreateIndexOf (name, callback) {
  return function (obj, val) {
    if (obj) {
      if (obj[name]) {
        return obj[name](val)
      }
      if (isString(obj) || isArray(obj)) {
        return callback(obj, val)
      }
      for (var key in obj) {
        if (hasOwnProp(obj, key)) {
          if (val === obj[key]) {
            return key
          }
        }
      }
    }
    return -1
  }
}

export default helperCreateIndexOf
