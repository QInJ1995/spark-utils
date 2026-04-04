/*
 * @Author: QINJIN
 * @Date: 2024-11-06 10:15:58
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-11-07 09:50:46
 * @FilePath: /spark-utils/src/log/image.js
 * @Description: image打印
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

import {isShowLog, isEmpty,} from './utils'
function image(urlOrTitle, url, scale = 1) {
  if (!isShowLog()) return
  let title = 'Image' 
  if(typeof url === 'number') {
    scale = url
    url = urlOrTitle 
  } else {
    title = isEmpty(url) ? 'Image' : urlOrTitle;
    url = isEmpty(url) ? urlOrTitle : url;
  }

  const color = '#9A55F2'
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    if (ctx) {
      c.width = img.width
      c.height = img.height
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0)
      const dataUri = c.toDataURL('image/png')

      console.log(
        `%c ${title} %c sup?`,
        `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
        `font-size: 1px;
                    padding: ${Math.floor((img.height * scale) / 2)}px ${Math.floor((img.width * scale) / 2)}px;
                    background-image: url(${dataUri});
                    background-repeat: no-repeat;
                    background-size: ${img.width * scale}px ${img.height * scale}px;
                    color: transparent;
                    margin-left: 4px;
                    `
      )
    }
  }
  img.src = url
}

export default image