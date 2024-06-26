import keys from '../basic/keys'
import slice from '../array/slice'
import includes from '../array/includes'
import arrayEach from '../array/arrayEach'
import assign from './assign'

/**
  * 将一个或者多个对象值解构到目标对象
  *
  * @param {Object} destination 目标对象
  * @param {...Object}
  * @return {Boolean}
  */
function destructuring (destination, sources) {
  if (destination && sources) {
    var rest = assign.apply(this, [{}].concat(slice(arguments, 1)))
    var restKeys = keys(rest)
    arrayEach(keys(destination), function (key) {
      if (includes(restKeys, key)) {
        destination[key] = rest[key]
      }
    })
  }
  return destination
}

export default destructuring
