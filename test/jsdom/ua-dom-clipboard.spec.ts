// @vitest-environment jsdom
/**
 * ua / dom / clipboard 模块（M5）测试：
 * - ua 惰性函数化：调用时才读 navigator/screen，stub 后立即生效；
 * - dom getStyle/getWidth/getHeight（stub getBoundingClientRect / getComputedStyle）；
 * - clipboard copyText（mock navigator.clipboard 与 document.execCommand 两条路径）；
 * - 子入口 import 冒烟（jsdom 下 import 成功且无 window 挂载副作用）。
 *
 * 运行说明（M5 过渡期）：src/browser 下旧 .js 与新 .ts 并存，vite 的扩展名
 * 解析顺序（.js 优先，且目录 index 优先于同名 .ts 子入口）会遮蔽新文件，
 * 故 import 显式带 .ts 后缀；'../../src/browser' 子入口被旧 src/browser/index.js
 * 遮蔽，冒烟用例改为直连各 .ts 模块聚合断言。旧 .js 删除（集成阶段）后
 * 可还原为无后缀子入口导入。
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as browserCookie from '../../src/browser/cookie'
import * as browserClipboard from '../../src/browser/clipboard'
import * as browserCrossDomain from '../../src/browser/crossDomain'
import * as browserDom from '../../src/browser/dom'
import * as browserStorage from '../../src/browser/storage'
import * as browserUa from '../../src/browser/ua'
import * as browserUrl from '../../src/browser/url'
import { copyText } from '../../src/browser/clipboard'
import { getHeight, getStyle, getWidth } from '../../src/browser/dom'
import {
  browse,
  clientBrowser,
  clientScreenSize,
  clientSystem,
  getBrowserInfo,
  isChrome,
  isFireFox,
  isSafari,
} from '../../src/browser/ua'

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const FIREFOX_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0'
const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (Version/16.0 Mobile/15E148 Safari/604.1'

function stubNavigator(props: { userAgent?: string; platform?: string }): void {
  for (const [key, value] of Object.entries(props)) {
    Object.defineProperty(window.navigator, key, { value, configurable: true })
  }
}

afterEach(() => {
  const navigator = window.navigator as unknown as Record<string, unknown>
  delete navigator.userAgent
  delete navigator.platform
  delete navigator.clipboard
  // jsdom 无 execCommand，用例以自有属性形式注入的 spy 在此移除
  delete (document as unknown as Record<string, unknown>).execCommand
  vi.restoreAllMocks()
})

describe('ua 惰性探测', () => {
  it('Chrome UA：isChrome / clientBrowser / getBrowserInfo', () => {
    stubNavigator({ userAgent: CHROME_UA, platform: 'Win32' })
    expect(isChrome()).toBe(true)
    expect(isSafari()).toBe(false)
    expect(isFireFox()).toBe(false)
    expect(clientBrowser()).toBe('chrome')
    expect(getBrowserInfo()).toEqual({ browser: 'chrome', version: '120' })
  })

  it('Firefox UA + Mac 平台：clientBrowser / clientSystem', () => {
    stubNavigator({ userAgent: FIREFOX_UA, platform: 'MacIntel' })
    expect(clientBrowser()).toBe('firefox')
    expect(isFireFox()).toBe(true)
    expect(clientSystem()).toBe('mac')
  })

  it('Windows 平台映射为 win；iPhone UA 命中 iphone', () => {
    stubNavigator({ userAgent: CHROME_UA, platform: 'Win32' })
    expect(clientSystem()).toBe('win')
    stubNavigator({ userAgent: IPHONE_UA, platform: 'iPhone' })
    expect(clientSystem()).toBe('iphone')
  })

  it('browse()：jsdom 下 isDoc 为真、存储探测可用、前缀键为布尔', () => {
    const info = browse()
    expect(info.isNode).toBe(false)
    expect(info.isDoc).toBe(true)
    expect(info.isLocalStorage).toBe(true)
    expect(info.isSessionStorage).toBe(true)
    expect(typeof info['-webkit']).toBe('boolean')
  })

  it('iPhone UA 下 browse() 判定移动端；clientScreenSize 返回 宽,高', () => {
    stubNavigator({ userAgent: IPHONE_UA })
    expect(browse().isMobile).toBe(true)
    expect(browse().isPC).toBe(false)
    expect(clientScreenSize()).toMatch(/^\d+,\d+$/)
  })
})

describe('dom 元素信息', () => {
  function makeRect(width: number, height: number): DOMRect {
    return {
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect
  }

  it('getWidth / getHeight 读取 getBoundingClientRect', () => {
    const el = document.createElement('div')
    el.getBoundingClientRect = () => makeRect(100, 50)
    expect(getWidth(el)).toBe(100)
    expect(getHeight(el)).toBe(50)
  })

  it('innerHeight=true 扣除上下内边距与边框', () => {
    const el = document.createElement('div')
    el.getBoundingClientRect = () => makeRect(100, 50)
    vi.spyOn(window, 'getComputedStyle').mockImplementation(
      () =>
        ({
          // padding-top 10px、border-top 2px，其余 0
          getPropertyValue: (prop: string) =>
            prop === 'padding-top' ? '10px' : prop === 'border-top' ? '2px' : '0px',
        }) as unknown as CSSStyleDeclaration,
    )
    expect(getHeight(el, true)).toBe(50 - 10 - 0 - 0 - 2)
  })

  it('getStyle 经 defaultView.getComputedStyle 取值', () => {
    const el = document.createElement('div')
    vi.spyOn(window, 'getComputedStyle').mockImplementation(
      () => ({ getPropertyValue: () => '4px' }) as unknown as CSSStyleDeclaration,
    )
    expect(getStyle(el, 'padding')).toBe('4px')
  })
})

describe('clipboard copyText', () => {
  it('优先走 navigator.clipboard.writeText', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', { value: { writeText }, configurable: true })
    await expect(copyText('hello')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('clipboard API 不可用时回退 execCommand 路径', async () => {
    // jsdom 未实现 execCommand，以自有属性注入 mock（真实浏览器该函数存在）
    const execCommand = vi.fn().mockReturnValue(true)
    document.execCommand = execCommand as unknown as Document['execCommand']
    await expect(copyText('legacy')).resolves.toBe(true)
    expect(execCommand).toHaveBeenCalledWith('copy')
  })

  it('null/undefined 归空串；execCommand 失败返回 false', async () => {
    document.execCommand = vi.fn().mockReturnValue(false) as unknown as Document['execCommand']
    await expect(copyText(null)).resolves.toBe(false)
  })
})

describe('browser 子入口 import 冒烟', () => {
  it('各子域模块（子入口的全部组成）在 jsdom 下 import 成功且导出可访问', () => {
    expect(typeof browserCookie.cookie).toBe('function')
    expect(typeof browserStorage.createWebStorage).toBe('function')
    expect(typeof browserDom.getStyle).toBe('function')
    expect(typeof browserUa.browse).toBe('function')
    expect(typeof browserUrl.parseUrl).toBe('function')
    expect(typeof browserCrossDomain.setupCrossDomain).toBe('function')
    expect(typeof browserClipboard.copyText).toBe('function')
  })

  it('import 不再向 window 挂载 receiveMessage / sendMessage（旧版副作用已移除）', () => {
    const globals = window as unknown as Record<string, unknown>
    expect(globals.receiveMessage).toBeUndefined()
    expect(globals.sendMessage).toBeUndefined()
  })
})
