/*
 * @Author: QINJIN
 * @Date: 2024-02-26 20:01:50
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-03 01:05:17
 * @FilePath: /spark-utils/index.js
 * @Description: index.js
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import StateFlow from './src/stateFlow.js'
import uniqueObjects from './src/uniqueObjects.js'
import onMountDialog from './src/onMountDialog.js'
import promiseResultHandle from './src/promiseResultHandle.js'
import debounce  from './src/debounce.js'
import throttle  from './src/throttle.js'
import clone  from './src/clone.js'

const SparkUtils = {
    StateFlow,
    uniqueObjects,
    onMountDialog,
    promiseResultHandle,
    debounce,
    throttle,
    clone 
}

export default SparkUtils



