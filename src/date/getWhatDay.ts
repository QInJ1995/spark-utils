import staticStrFirst from '../constant/static/staticStrFirst'
import staticStrLast from '../constant/static/staticStrLast'
import staticParseInt from '../constant/static/staticParseInt'
import helperGetDateFullYear from '../helpers/helperGetDateFullYear'
import helperGetDateMonth from '../helpers/helperGetDateMonth'
import helperGetDateTime from '../helpers/helperGetDateTime'
import toStringDate from './toStringDate'
import isValidDate from '../basic/isValidDate'

/**
  * 返回前几天或后几天的日期
  *
  * @param {Date} date 日期或数字
  * @param {Number} day 天(默认当天)、前几天、后几天
  * @param {String} mode 获取时分秒(null默认当前时分秒)、日初(first)、日末(last)
  * @return {Date}
  */
function getWhatDay (date, day, mode) {
  date = toStringDate(date)
  if (isValidDate(date) && !isNaN(day)) {
    date.setDate(date.getDate() + staticParseInt(day))
    if (mode === staticStrFirst) {
      return new Date(helperGetDateFullYear(date), helperGetDateMonth(date), date.getDate())
    } else if (mode === staticStrLast) {
      return new Date(helperGetDateTime(getWhatDay(date, 1, staticStrFirst)) - 1)
    }
  }
  return date
}

export default getWhatDay
