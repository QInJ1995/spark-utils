/*
 * @Author: QINJIN
 * @Date: 2024-02-26 20:01:50
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-15 16:01:53
 * @FilePath: /spark-utils/src/index.js
 * @Description: index.js
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

// basic
import basic from './basic'
// array
import arrayMethods from './array'
// function 
import functionMethods from './function'
// object
import objectMethods from './object'
// other 
import otherMethods from './other'

const SparkUtils = {
    ...basic,
    ...arrayMethods,
    ...functionMethods,
    ...objectMethods,
    ...otherMethods
}

export default SparkUtils



