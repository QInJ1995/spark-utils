/*
 * @Author: QINJIN
 * @Date: 2024-02-26 20:01:50
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-13 17:51:54
 * @FilePath: /spark-utils/src/index.js
 * @Description: index.js
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import StateFlow from './other/stateFlow.js'
import uniqueObjects from './other/uniqueObjects.js'
import onMountDialog from './other/onMountDialog.js'
import promiseResultHandle from './other/promiseResultHandle.js'
import debounce  from './function/debounce.js'
import throttle  from './function/throttle.js'
import clone  from './object/clone.js'
import toArrayTree  from './array/toArrayTree'
import toTreeArray from './array/toTreeArray'

const SparkUtils = {
    StateFlow,
    uniqueObjects,
    onMountDialog,
    promiseResultHandle,
    debounce,
    throttle,
    clone,
    toArrayTree,
    toTreeArray
}

export default SparkUtils



