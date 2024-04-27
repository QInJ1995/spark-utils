/*
 * @Author: QINJIN
 * @Date: 2024-04-26 14:24:21
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-27 09:38:59
 * @FilePath: /spark-utils/src/https/index.js
 * @Description: 网络请求方法聚合
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import axios from "axios";
import init from './init'

export default {
  https: {
    axios,
    init,
  },
}
