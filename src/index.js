/*
 * @Author: QINJIN
 * @Date: 2024-02-26 20:01:50
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-15 16:38:36
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
    ...otherMethods
}

export default SparkUtils



