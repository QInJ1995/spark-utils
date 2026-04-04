function helperCreateToNumber (handle) {
  return function (str) {
    if (str) {
      const num = handle(str)
      if (!isNaN(num)) {
        return num
      }
    }
    return 0
  }
}

export default helperCreateToNumber
