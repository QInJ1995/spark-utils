/*
 * @Author: QINJIN
 * @Date: 2024-02-26 20:01:50
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-11-06 10:33:07
 * @FilePath: /spark-utils/src/index.js
 * @Description: index.js
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

// basic
import basicMethods from './basic'
// array
import arrayMethods from './array'
// date
import dateMethods from './date'
// number
import numberMethods from './number'
// function 
import functionMethods from './function'
// object
import objectMethods from './object'
// string
import stringMethods from './string'
// browse
import browserMethod from './browser'
// global
import globalMethod from './global'
// storage
import storageMethod from './storage'
// cookie
import cookieMethod from './cookie'
// dom
import domMethod from './dom'
// crypto
import cryptoMethod from './crypto'
// https
import httpsMethod from './https'
// log
import logMethod from './log'
// other 
import otherMethods from './other'

const SparkUtils = {
  ...basicMethods,
  ...arrayMethods,
  ...dateMethods,
  ...numberMethods,
  ...functionMethods,
  ...objectMethods,
  ...stringMethods,
  ...browserMethod,
  ...globalMethod,
  ...storageMethod,
  ...cookieMethod,
  ...domMethod,
  ...cryptoMethod,
  ...httpsMethod,
  ...logMethod,
  ...otherMethods,
}

export default SparkUtils



