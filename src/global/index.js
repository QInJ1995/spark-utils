/*
 * @Author: QINJIN
 * @Date: 2024-04-20 20:10:47
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-20 20:22:44
 * @FilePath: /spark-utils/src/global/index.js
 * @Description: 全局方法聚合
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import setupDefaults from '../constant/setup/setupDefaults' 
import setup from './setup'
import mixin from './mixin'


export default {
	setup,
	mixin,
	setupDefaults,
}
