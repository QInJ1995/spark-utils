function arrayIndexOf (list, val) {
  if (list.indexOf) {
    return list.indexOf(val)
  }
  for (let index = 0, len = list.length; index < len; index++) {
    if (val === list[index]) {
      return index
    }
  }
}

export default arrayIndexOf
