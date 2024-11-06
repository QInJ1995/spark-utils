/*
 * @Author: QINJIN
 * @Date: 2024-11-06 10:15:58
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-11-06 14:34:36
 * @FilePath: /spark-utils/src/log/image.js
 * @Description: image打印
 * Copyright (c) 2024 by ${四川久远银海软件股份有限公司}, All Rights Reserved. 
 */

import {isProduction,} from './utils'
function image(url, scale = 1) {
  if (isProduction()) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    if (ctx) {
      c.width = img.width;
      c.height = img.height;
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      const dataUri = c.toDataURL('image/png');

      console.log(
        `%c sup?`,
        `font-size: 1px;
                    padding: ${Math.floor((img.height * scale) / 2)}px ${Math.floor((img.width * scale) / 2)}px;
                    background-image: url(${dataUri});
                    background-repeat: no-repeat;
                    background-size: ${img.width * scale}px ${img.height * scale}px;
                    color: transparent;
                    `
      );
    }
  };
  img.src = url;
}

export default image