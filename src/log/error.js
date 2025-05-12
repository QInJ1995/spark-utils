/*
 * @Author: QINJIN
 * @Date: 2024-11-06 10:15:58
 * @LastEditors: QINJIN
 * @LastEditTime: 2025-05-08 16:31:04
 * @FilePath: /spark-utils/src/log/error.js
 * @Description: error打印
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import {formatPrint, isEmpty, isShowLog,} from './utils'
function error(textOrTitle, content = '') {
  if (!isShowLog()) return
  const title = isEmpty(content) ? 'Error' : textOrTitle;
  let text = isEmpty(content) ? textOrTitle : content;
  formatPrint(title, text, '#F56C6C');
}

export default error