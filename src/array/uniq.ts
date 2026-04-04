import each from '../basic/each'
import includes from './includes'

/**
  * 数组去重
  *
  * @param {Array} array 数组
  * @return {Array}
  */
function uniq (array) {
  const result = []
  each(array, function (value) {
    if (!includes(result, value)) {
      result.push(value)
    }
  })
  return result
}

export default uniq
