/*
 * @Author: QINJIN
 * @Date: 2024-02-26 20:01:50
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-24 22:11:39
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
import browseMethod from './browse'
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
    ...browseMethod,
    ...globalMethod,
    ...storageMethod,
    ...cookieMethod,
    ...domMethod,
    ...cryptoMethod,
    ...otherMethods,
}

export default SparkUtils



