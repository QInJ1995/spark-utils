import random from '../number/random'
import values from '../basic/values'

/**
  * 将一个数组随机打乱，返回一个新的数组
  *
  * @param {Array} array 数组
  * @return {Array}
  */
function shuffle (array) {
  let index
  const result = []
  const list = values(array)
  let len = list.length - 1
  for (; len >= 0; len--) {
    index = len > 0 ? random(0, len) : 0
    result.push(list[index])
    list.splice(index, 1)
  }
  return result
}

export default shuffle
