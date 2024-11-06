/*
 * @Author: QINJIN
 * @Date: 2024-11-06 10:15:58
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-11-06 15:03:25
 * @FilePath: /spark-utils/src/log/info.js
 * @Description: info打印
 * Copyright (c) 2024 by ${四川久远银海软件股份有限公司}, All Rights Reserved. 
 */

import {formatPrint, isEmpty,} from './utils'
function info(textOrTitle, content = '') {
  const title = isEmpty(content) ? 'Info' : textOrTitle;
  let text = isEmpty(content) ? textOrTitle : content;
  if(typeof text === 'object' && text !== null) {
    text = JSON.stringify(text)
  }
  formatPrint(title, text, '#909399');
}

export default info