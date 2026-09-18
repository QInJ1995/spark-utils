/**
 * createStyledLogger —— 主题色打印函数工厂（2.0 新增）
 *
 * 旧 src/log/ 下 info/success/warning/error 四个文件仅颜色与默认标题不同（各自 550 字节的
 * 复制粘贴），2.0 合并为该工厂；旧方法名经 src/log/index.ts 以工厂产物保留。
 * 单参/双参语义与旧版一致：content 为空（null/undefined/''）时按「单参」处理——
 * textOrTitle 作文本、默认标题作徽章；否则 textOrTitle 作标题、content 作文本。
 */
import { isShowLog } from './isShowLog'
import { formatPrint, logIsEmpty } from './print'

/** 样式描述 */
export interface LoggerStyle {
  /** 单参调用时的默认标题（旧版各方法的 Info/Success/Warning/Error） */
  title: string
  /** 主题色 #RRGGBB（浏览器用于 %c，node 量化为 ANSI 256 色） */
  color: string
}

/** createStyledLogger 创建的打印函数（旧版各打印方法的签名） */
export type StyledLogger = (textOrTitle: unknown, content?: unknown) => void

/**
 * 创建带样式的打印函数
 *
 * @param style 标题与主题色
 * @returns 打印函数：受 isShowLog 开关控制，单参时输出「默认标题 + 文本」，双参时输出「标题 + 文本」
 */
export function createStyledLogger(style: LoggerStyle): StyledLogger {
  return function styledLogger(textOrTitle: unknown, content?: unknown): void {
    if (!isShowLog()) {
      return
    }
    const isSingle = logIsEmpty(content)
    const title = isSingle ? style.title : textOrTitle
    const text = isSingle ? textOrTitle : content
    formatPrint(title, text, style.color)
  }
}
