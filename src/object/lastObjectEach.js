import lastArrayEach from '../array/lastArrayEach'
import keys from '../basic/keys'

function lastObjectEach (obj, iterate, context) {
  lastArrayEach(keys(obj), function (key) {
    iterate.call(context, obj[key], key, obj)
  })
}

export default lastObjectEach
