/**
 * image 打印（移植自旧 src/log/image.js，浏览器专属）
 *
 * 加载图片并经 canvas 转为 dataURI，以背景图方式打印到控制台（旧版样式串逐字保留）。
 * 2.0 同构化：node 环境无 Image/canvas，旧版会直接抛 ReferenceError，新版安全 no-op。
 * 主包无 DOM lib，浏览器全局对象经 globalThis / getDocument 以最小结构类型访问。
 */
import { getDocument, isBrowser } from '../internal/env'
import { isShowLog } from './isShowLog'
import { logIsEmpty } from './print'

/** Image 的最小结构（仅用到本方法的成员） */
interface ImageLike {
  crossOrigin?: string
  onload?: (() => void) | null
  readonly width: number
  readonly height: number
  src: string
}

/** canvas 2d 上下文的最小结构 */
interface CanvasRenderingContext2DLike {
  fillStyle: string
  fillRect(x: number, y: number, width: number, height: number): void
  drawImage(image: ImageLike, dx: number, dy: number): void
}

/** canvas 元素的最小结构 */
interface CanvasElementLike {
  width: number
  height: number
  getContext(contextId: '2d'): CanvasRenderingContext2DLike | null
  toDataURL(type: string): string
}

/** document 的最小结构 */
interface DocumentLike {
  createElement(tagName: 'canvas'): CanvasElementLike
}

const IMAGE_COLOR = '#9A55F2'

/**
 * image 打印（浏览器专属，node 下 no-op）
 *
 * @param urlOrTitle 单参时为图片地址；双参时为标题
 * @param url 图片地址（传数字时按缩放比处理，兼容旧签名）
 * @param scale 缩放比，默认 1
 */
export function image(urlOrTitle: string, url?: string | number, scale = 1): void {
  if (!isShowLog()) {
    return
  }
  if (!isBrowser) {
    // node：无 Image/canvas，安全 no-op（旧版在此抛 ReferenceError）
    return
  }
  const ImageCtor = (globalThis as { Image?: new () => ImageLike }).Image
  const doc = getDocument() as DocumentLike | undefined
  if (!ImageCtor || !doc) {
    return
  }

  let title = 'Image'
  let imageURL: string
  if (typeof url === 'number') {
    scale = url
    imageURL = urlOrTitle
  } else {
    title = logIsEmpty(url) ? 'Image' : urlOrTitle
    imageURL = logIsEmpty(url) ? urlOrTitle : (url as string)
  }

  const img = new ImageCtor()
  img.crossOrigin = 'anonymous'
  img.onload = (): void => {
    const canvas = doc.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      canvas.width = img.width
      canvas.height = img.height
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      const dataUri = canvas.toDataURL('image/png')

      console.log(
        `%c ${title} %c sup?`,
        `background:${IMAGE_COLOR};border:1px solid ${IMAGE_COLOR}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
        `font-size: 1px;
                    padding: ${Math.floor((img.height * scale) / 2)}px ${Math.floor((img.width * scale) / 2)}px;
                    background-image: url(${dataUri});
                    background-repeat: no-repeat;
                    background-size: ${img.width * scale}px ${img.height * scale}px;
                    color: transparent;
                    margin-left: 4px;
                    `,
      )
    }
  }
  img.src = imageURL
}
