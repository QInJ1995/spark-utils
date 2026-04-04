import isNumber from './isNumber'

 
function isNumberNaN (obj) {
  return isNumber(obj) && isNaN(obj)
}

export default isNumberNaN
