/*
 * @Author: QINJIN
 * @Date: 2024-11-06 10:15:58
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-11-06 19:35:50
 * @FilePath: /spark-utils/src/log/warning.js
 * @Description: warning打印
 * Copyright (c) 2024 by ${四川久远银海软件股份有限公司}, All Rights Reserved. 
 */

import {formatPrint, isEmpty, isShowLog,} from './utils'
function warning(textOrTitle, content = '') {
  if (!isShowLog()) return
  const title = isEmpty(content) ? 'Warning' : textOrTitle;
  let text = isEmpty(content) ? textOrTitle : content;
  formatPrint(title, text, '#E6A23C');
}

export default warning