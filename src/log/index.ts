/*
 * @Author: QINJIN
 * @Date: 2024-11-06 10:29:36
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-11-06 14:35:13
 * @FilePath: /spark-utils/src/log/index.js
 * @Description: Log 方法聚合
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */
import info from './info'
import error from './error'
import warning from './warning'
import success from './success'
import table from './table'
import image from './image'

export default {
  log: {
    info,
    error,
    warning,
    warn: warning,
    success,
    table,
    image,
  },
}
