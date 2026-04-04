/*
 * @Author: QINJIN
 * @Date: 2024-04-15 16:09:06
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-29 10:53:25
 * @FilePath: /spark-utils/src/date/index.js
 * @Description: 日期处理方法聚合
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */
import moment from 'moment'
import getMoment from './getMoment'
import stringToMoment from './stringToMoment'
import stringArrayToMomentArray from './stringArrayToMomentArray'
import momentToString from './momentToString'
import momentArrayToStringArray from './momentArrayToStringArray'
import dateToMoment from './dateToMoment'
import dateToString from './dateToString'
import momentToDate from './momentToDate'
import isTime from './isTime'
import isDateTime from './isDateTime'
import getCurDate from './getCurDate'
import getCurDateMonth from './getCurDateMonth'
import getCurDateTime from './getCurDateTime'
import getCurDateFullTime from './getCurDateFullTime'
import getCurQuarter from './getCurQuarter'
import getCurIssue from './getCurIssue'
import getCurDateYear from './getCurDateYear'
import StringToDate from './StringToDate'
import dateDiff from './dateDiff'
import now from './now'
import timestamp from './timestamp'
import toStringDate from './toStringDate'
import toDateString from './toDateString'
import getWhatYear from './getWhatYear'
import getWhatMonth from './getWhatMonth'
import getWhatWeek from './getWhatWeek'
import getWhatDay from './getWhatDay'
import getDayOfYear from './getDayOfYear'
import getYearDay from './getYearDay'
import getYearWeek from './getYearWeek'
import getMonthWeek from './getMonthWeek'
import getDayOfMonth from './getDayOfMonth'
import getDateDiff from './getDateDiff'

export default {
  moment,
  getMoment,
  stringToMoment,
  stringArrayToMomentArray,
  momentToString,
  momentArrayToStringArray,
  dateToMoment,
  dateToString,
  momentToDate,
  isTime,
  isDateTime,
  getCurDate,
  getCurDateMonth,
  getCurDateTime,
  getCurDateFullTime,
  getCurQuarter,
  getCurIssue,
  getCurDateYear,
  StringToDate,
  dateDiff,
  now,
  timestamp,
  toStringDate,
  toDateString,
  getWhatYear,
  getWhatMonth,
  getWhatWeek,
  getWhatDay,
  getDayOfYear,
  getYearDay,
  getYearWeek,
  getMonthWeek,
  getDayOfMonth,
  getDateDiff,
}
