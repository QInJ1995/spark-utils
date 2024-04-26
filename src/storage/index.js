/*
 * @Author: QINJIN
 * @Date: 2024-04-22 17:38:49
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-22 20:00:55
 * @FilePath: /spark-utils/src/storage/index.js
 * @Description: 缓存方法聚合
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import {createWebStorage, getStorage, init, } from './webStorages'

export default {
	createWebStorage,
	getStorage,
	webStorage: {
		createWebStorage,
		init, 
	},
}
