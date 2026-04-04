import map from './map'
import isArray from '../basic/isArray'

function deepGetObj (obj, path) {
  let index = 0
  const len = path.length
  while (obj && index < len) {
    obj = obj[path[index++]]
  }
  return len && obj ? obj : 0
}

/**
 * 在list的每个元素上执行方法,任何传递的额外参数都会在调用方法的时候传递给它
 *
 * @param {Array} list
 * @param {Array/String/Function} path
 * @param {...Object} arguments
 * @return {Array}
 */
function invoke (list, path) {
  let func
  const args = arguments
  const params = []
  const paths = []
  let index = 2
  let len = args.length
  for (; index < len; index++) {
    params.push(args[index])
  }
  if (isArray(path)) {
    len = path.length - 1
    for (index = 0; index < len; index++) {
      paths.push(path[index])
    }
    path = path[len]
  }
  return map(list, function (context) {
    if (paths.length) {
      context = deepGetObj(context, paths)
    }
    func = context[path] || path
    if (func && func.apply) {
      return func.apply(context, params)
    }
  })
}

export default invoke
