import helperGetDateTime from '../helpers/helperGetDateTime'
import helperNewDate from '../helpers/helperNewDate'

/**
 * 返回当前时间戳
 *
 * @returns Number
 */
var now = Date.now || function () {
  return helperGetDateTime(helperNewDate())
}

export default now
