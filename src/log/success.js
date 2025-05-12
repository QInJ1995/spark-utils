/*
 * @Author: QINJIN
 * @Date: 2024-11-06 10:15:58
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-11-06 11:05:49
 * @FilePath: /spark-utils/src/log/success.js
 * @Description: success打印
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import {formatPrint, isEmpty,isShowLog,} from './utils'
function success(textOrTitle, content = '') {
  if (!isShowLog()) return
  const title = isEmpty(content) ? 'Success' : textOrTitle;
  let text = isEmpty(content) ? textOrTitle : content;
  formatPrint(title, text, '#67C23A');
}

export default success