/*
 * @Author: QINJIN
 * @Date: 2024-11-06 10:15:58
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-11-06 15:04:24
 * @FilePath: /spark-utils/src/log/error.js
 * @Description: error打印
 * Copyright (c) 2024 by ${四川久远银海软件股份有限公司}, All Rights Reserved. 
 */

import {formatPrint, isEmpty, isShowLog,} from './utils'
function error(textOrTitle, content = '') {
  if (!isShowLog()) return
  const title = isEmpty(content) ? 'Error' : textOrTitle;
  let text = isEmpty(content) ? textOrTitle : content;
  formatPrint(title, text, '#F56C6C');
}

export default error