import staticStrUndefined from '../constant/static/staticStrUndefined'
import helperCreateInTypeof from '../helpers/helperCreateInTypeof'

/**
  * 判断是否Undefined
  *
  * @param {Object} obj 对象
  * @return {Boolean}
  */
const isUndefined = helperCreateInTypeof(staticStrUndefined)

export default isUndefined
