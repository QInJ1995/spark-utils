/**
 * log 模块测试（M5：TS 重写后行为锁定，node 环境）
 *
 * 覆盖：isShowLog 的 node 默认关闭 / setup 显式开启与关闭、单参与双参调用形态、
 * node 分支的 ANSI 输出格式（对象走 %o、文本走前景色）、四个预置 logger 与
 * createStyledLogger 自建 logger、table 的折叠分组输出、image 在 node 下的安全 no-op。
 *
 * 注意：
 * - 用例顺序有依赖：node 默认关闭的断言必须先于任何 setup() 调用执行（vitest 按声明顺序运行）；
 * - '../../src/log/index.ts' 的显式 .ts 后缀是旧 .js 并存期（Vite 解析优先命中 index.js）
 *   的临时方案，集成删除旧 .js 后还原为无后缀；
 * - node 分支只测 ANSI 输出；浏览器 %c 分支依赖 DOM 控制台，由 jsdom 里程碑覆盖（如需）。
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  info,
  error,
  warning,
  warn,
  success,
  table,
  image,
  createStyledLogger,
} from '../../src/log/index'
import { setup } from '../../src/internal/config'

function mockConsoleLog() {
  return vi.spyOn(console, 'log').mockImplementation(() => undefined)
}
function mockConsoleGroup() {
  return vi.spyOn(console, 'groupCollapsed').mockImplementation(() => undefined)
}
function mockConsoleTable() {
  return vi.spyOn(console, 'table').mockImplementation(() => undefined)
}
function mockConsoleGroupEnd() {
  return vi.spyOn(console, 'groupEnd').mockImplementation(() => undefined)
}

let logSpy: ReturnType<typeof mockConsoleLog>
let groupSpy: ReturnType<typeof mockConsoleGroup>
let tableSpy: ReturnType<typeof mockConsoleTable>
let groupEndSpy: ReturnType<typeof mockConsoleGroupEnd>

beforeEach(() => {
  logSpy = mockConsoleLog()
  groupSpy = mockConsoleGroup()
  tableSpy = mockConsoleTable()
  groupEndSpy = mockConsoleGroupEnd()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('log（node 环境）', () => {
  it('node 默认关闭：所有打印方法均为 no-op（须先于 setup() 执行）', () => {
    info('hello')
    error('boom')
    warning('careful')
    success('done')
    table('T', { a: 1 })
    image('https://example.com/x.png', 2)
    expect(logSpy).not.toHaveBeenCalled()
    expect(groupSpy).not.toHaveBeenCalled()
  })

  it('setup({ showLog: true }) 开启后：单参调用输出默认标题徽章 + ANSI 着色文本', () => {
    setup({ showLog: true })
    info('hello')
    expect(logSpy).toHaveBeenCalledTimes(1)
    const firstArg = logSpy.mock.calls[0]?.[0] as string
    expect(firstArg).toContain('Info')
    expect(firstArg).toContain('hello')
    // ANSI 徽章：256 色背景（#909399 量化为 48;5;145）+ 亮白前景 97
    expect(firstArg).toContain('\u001b[48;5;145m')
    expect(firstArg).toContain('\u001b[97m')
    expect(firstArg).toMatch(/\u001b\[38;5;\d+m/)
    expect(firstArg).toContain('\u001b[0m')
  })

  it('双参调用：首参作标题、次参作文本（空串/null/undefined 次参回落单参形态）', () => {
    info('标题T', '内容C')
    expect(logSpy).toHaveBeenCalledTimes(1)
    const firstArg = logSpy.mock.calls[0]?.[0] as string
    expect(firstArg).toContain('标题T')
    expect(firstArg).toContain('内容C')
    expect(firstArg).not.toContain('Info')

    info('only', '')
    expect(logSpy).toHaveBeenCalledTimes(2)
    expect(logSpy.mock.calls[1]?.[0]).toContain('Info')
  })

  it('对象内容走 %o 分支：徽章串 + 格式符，对象作第二实参', () => {
    info('Obj', { a: 1 })
    expect(logSpy).toHaveBeenCalledTimes(1)
    const [firstArg, secondArg] = logSpy.mock.calls[0] as unknown as [string, unknown]
    expect(firstArg).toContain('Obj')
    expect(firstArg).toContain('%o')
    expect(secondArg).toEqual({ a: 1 })
  })

  it('warn 为 warning 的同引用别名；error/success 主题色不同（ANSI 背景码不同）', () => {
    expect(warn).toBe(warning)
    error('e')
    success('s')
    expect(logSpy).toHaveBeenCalledTimes(2)
    const errorArg = logSpy.mock.calls[0]?.[0] as string
    const successArg = logSpy.mock.calls[1]?.[0] as string
    expect(errorArg).toContain('Error')
    expect(successArg).toContain('Success')
    // #F56C6C → 48;5;210，#67C23A → 48;5;113，二者互不相同
    expect(errorArg).not.toBe(successArg)
    expect(errorArg).toContain('\u001b[48;5;210m')
    expect(successArg).toContain('\u001b[48;5;113m')
  })

  it('createStyledLogger 自建 logger：自定义标题与颜色（黑量化为灰阶 16）', () => {
    const mine = createStyledLogger({ title: 'Mine', color: '#000000' })
    mine('x')
    expect(logSpy).toHaveBeenCalledTimes(1)
    const firstArg = logSpy.mock.calls[0]?.[0] as string
    expect(firstArg).toContain('Mine')
    expect(firstArg).toContain('x')
    expect(firstArg).toContain('\u001b[48;5;16m')
  })

  it('table：对象内容走 groupCollapsed + console.table + groupEnd，非对象不输出', () => {
    table('T', { a: 1 })
    expect(groupSpy).toHaveBeenCalledTimes(1)
    expect(groupSpy.mock.calls[0]?.[0]).toContain('T')
    expect(tableSpy).toHaveBeenCalledWith({ a: 1 })
    expect(groupEndSpy).toHaveBeenCalledTimes(1)

    table('just a string')
    expect(groupSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).not.toHaveBeenCalled()
  })

  it('image：node 环境安全 no-op（开启状态下也不输出、不抛错）', () => {
    expect(() => image('https://example.com/x.png', 2)).not.toThrow()
    expect(logSpy).not.toHaveBeenCalled()
  })

  it('setup({ showLog: false }) 显式关闭：不再输出', () => {
    setup({ showLog: false })
    info('hidden')
    expect(logSpy).not.toHaveBeenCalled()
  })
})
