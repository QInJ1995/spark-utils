/*
 * @Author: QINJIN
 * @Date: 2024-04-15 15:52:38
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-17 17:06:11
 * @FilePath: /spark-utils/src/function/index.js
 * @Description: 封装方法聚合
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import noop from './noop'
import delay from './delay'
import bind from './bind'
import once from './once'
import after from './after'
import before from './before'
import throttle  from './throttle.js'
import debounce  from './debounce.js'

export default {
	noop,
	delay,
	bind,
	once,
	after,
	before,
	throttle,
	debounce,
}
