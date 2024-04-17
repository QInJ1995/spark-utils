/*
 * @Author: QINJIN
 * @Date: 2024-04-15 15:55:53
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-17 15:16:42
 * @FilePath: /spark-utils/src/object/index.js
 * @Description: 对象方法聚合 
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import has from './has';
import get from './get'
import set from './set'
import clear from './clear'
import assign from './assign'
import merge from './merge'
import clone  from './clone.js'
import destructuring from './destructuring'
import objectEach from './objectEach'
import lastObjectEach from './lastObjectEach'
import objectMap from './objectMap'
import pick from './pick'
import omit from './omit'

export default {
    has,
    get,
    set,
    clear,
    assign,
    merge,
    clone,
    destructuring,
    objectEach,
    lastObjectEach,
    objectMap,
    pick,
    omit
}
