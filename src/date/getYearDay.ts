import staticDayTime from '../constant/static/staticDayTime'
import staticStrFirst from '../constant/static/staticStrFirst'
import helperGetYMDTime from '../helpers/helperGetYMDTime'
import getWhatYear from './getWhatYear'
import toStringDate from './toStringDate'
import isValidDate from '../basic/isValidDate'

/**
  * 返回某个年份的第几天
  *
  * @param {Date} date 日期或数字
  * @return {Number}
  */
function getYearDay (date) {
  date = toStringDate(date)
  if (isValidDate(date)) {
    return Math.floor((helperGetYMDTime(date) - helperGetYMDTime(getWhatYear(date, 0, staticStrFirst))) / staticDayTime) + 1
  }
  return NaN
}

export default getYearDay
