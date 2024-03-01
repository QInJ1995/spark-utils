/*
 * @Author: QINJIN
 * @Date: 2024-02-26 20:01:50
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-03-01 10:59:10
 * @FilePath: /spark-utils/index.js
 * @Description: index.js
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import getDataTypeDefault from "./src/getDataType.js"
import stateFlowDefault from './src/stateFlow.js'
import uniqueObjectsDefault from './src/uniqueObjects.js'
import parseUrlParamsDefault from './src/parseUrlParams.js'
import onMountDialogDefault from './src/onMountDialog.js'
import promiseResultHandleDefault from './src/promiseResultHandle.js'

export const getDataType = getDataTypeDefault 
export const StateFlow = stateFlowDefault 
export const uniqueObjects = uniqueObjectsDefault 
export const parseUrlParams = parseUrlParamsDefault 
export const onMountDialog = onMountDialogDefault 
export const promiseResultHandle = promiseResultHandleDefault 

export default {
    getDataType,
    StateFlow,
    uniqueObjects,
    parseUrlParams,
    onMountDialog,
    promiseResultHandle 
}


