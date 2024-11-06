/*
 * @Author: QINJIN
 * @Date: 2024-11-06 10:15:58
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-11-06 14:27:41
 * @FilePath: /spark-utils/src/log/table.js
 * @Description: table打印
 * Copyright (c) 2024 by ${四川久远银海软件股份有限公司}, All Rights Reserved. 
 */

import isArray from '../basic/isArray'
function table(data) {
  if( typeof data !== 'object' ) {
    console.log(data)
    return 
  }
  // 生成th
  let thData = data
  if (Array.isArray(data) && data.length && (typeof data[0] === 'object' && data[0] !== null)) {
    thData = data[0]
  } 
  const keys = Object.keys(thData)
  const th = keys.reduce((pre, cur) => {
    const text = (pre.text || '' ) + `%c ${cur}` 
    const styles = pre.styles || []
    styles.push('color: white; background-color: black; padding: 2px 10px;')
    return {text, styles,}
  }, {})
  console.log(th.text, ...th.styles)

  // 生成row
  let rowData = data
  if (!isArray(data)) {
    rowData = [data]
  } 
  const rows = rowData.reduce((pre, cur, index) => {
    if(typeof cur === 'object' && cur !== null) {
      const keys = Object.keys(cur)
      const row= keys.reduce((pre, curKey, index) => {
        const text = (pre.text || '' ) + `%c ${cur[curKey]}` 
        const styles = pre.styles || []
        styles.push('color: black; background-color: lightgray; padding: 2px 10px;')
        return {text, styles,} 
      }, {})
      pre.push(row)
    } else {
      if(pre.length) {
        const text = (pre[0].text || '' ) + `%c ${cur}` 
        const styles = pre[0].styles 
        styles.push('color: black; background-color: lightgray; padding: 2px 10px;')
        pre[0] = {text, styles,}
      } else {
        const text = `%c ${cur}`
        const styles = ['color: black; background-color: lightgray; padding: 2px 10px;']
        pre.push({text, styles,} )
      }
    }
    return pre 
  }, [])
  rows.forEach((row) => {
    console.log(row.text, ...row.styles);
  });
}

export default table