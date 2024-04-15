/*
 * @Author: QINJIN
 * @Date: 2024-02-26 20:01:50
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-15 16:14:03
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
// data
import dataMethods from './data'
// function 
import functionMethods from './function'
// object
import objectMethods from './object'
// other 
import otherMethods from './other'

const SparkUtils = {
    ...basicMethods,
    ...arrayMethods,
    ...dateMethods,
    ...dataMethods,
    ...functionMethods,
    ...objectMethods,
    ...otherMethods
}

export default SparkUtils



