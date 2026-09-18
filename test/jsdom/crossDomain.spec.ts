// @vitest-environment jsdom
/**
 * crossDomain 模块（M5 安全重设计）测试：
 * setupCrossDomain 白名单 / 未注册 origin 拒绝（mock MessageEvent）/
 * 未注册调用名丢弃 / 回执回发到对端 origin / destroy / sendMessage
 *
 * 运行说明（M5 过渡期）：import 显式带 .ts 后缀绕开旧 .js 的扩展名遮蔽
 * （见 cookie.spec.ts 头注释），旧 .js 删除后可还原。
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendMessage, setupCrossDomain } from '../../src/browser/crossDomain'
import type { CrossDomainHandle } from '../../src/browser/crossDomain'

const TRUSTED = 'https://trusted.example'
const EVIL = 'https://evil.example'

let handle: CrossDomainHandle | false = false

afterEach(() => {
  if (handle !== false) {
    handle.destroy()
    handle = false
  }
})

/** 构造并派发一条 message 事件（source 默认本 window） */
function dispatch(data: unknown, origin: string, source: Window | null = window): void {
  window.dispatchEvent(new MessageEvent('message', { data, origin, source }))
}

function callMessage(callFun: string, arg?: unknown, callBackFun?: string): Record<string, unknown> {
  return { crossDomain: true, call: true, callFun, arg, callBackFun }
}

describe('setupCrossDomain 白名单', () => {
  it('已注册 origin + 已注册调用名 → 执行并透传 arg', () => {
    const echo = vi.fn((arg: unknown) => ({ echoed: arg }))
    handle = setupCrossDomain({ allowOrigins: [TRUSTED], allowCalls: { echo } })
    expect(handle).not.toBe(false)
    dispatch(callMessage('echo', { v: 1 }), TRUSTED)
    expect(echo).toHaveBeenCalledTimes(1)
    expect(echo).toHaveBeenCalledWith({ v: 1 })
  })

  it('未注册 origin 的消息被拒绝（不执行任何调用）', () => {
    const sink = vi.fn()
    handle = setupCrossDomain({ allowOrigins: [TRUSTED], allowCalls: { sink } })
    expect(handle).not.toBe(false)
    dispatch(callMessage('sink', 'x'), EVIL)
    expect(sink).not.toHaveBeenCalled()
  })

  it('已注册 origin 但调用名未在 allowCalls 注册 → 丢弃且不抛错', () => {
    const sink = vi.fn()
    handle = setupCrossDomain({ allowOrigins: [TRUSTED], allowCalls: { sink } })
    expect(handle).not.toBe(false)
    expect(() => dispatch(callMessage('notRegistered', 'x'), TRUSTED)).not.toThrow()
    expect(sink).not.toHaveBeenCalled()
  })

  it('非 crossDomain 协议消息被忽略', () => {
    const sink = vi.fn()
    handle = setupCrossDomain({ allowOrigins: [TRUSTED], allowCalls: { sink } })
    expect(handle).not.toBe(false)
    dispatch({ foo: 'bar' }, TRUSTED)
    dispatch('plain-string', TRUSTED)
    expect(sink).not.toHaveBeenCalled()
  })

  it('未 setup（或已 destroy）时不响应任何消息', () => {
    const sink = vi.fn()
    const local = setupCrossDomain({ allowOrigins: [TRUSTED], allowCalls: { sink } })
    expect(local).not.toBe(false)
    if (local !== false) {
      local.destroy()
    }
    dispatch(callMessage('sink', 'x'), TRUSTED)
    expect(sink).not.toHaveBeenCalled()
  })
})

describe('crossDomain 回执', () => {
  it('携带 callBackFun 时结果回发到 event.source，targetOrigin 为对端 origin', () => {
    const peer = { postMessage: vi.fn() } as unknown as Window
    const echo = vi.fn((arg: unknown) => arg)
    handle = setupCrossDomain({ allowOrigins: [TRUSTED], allowCalls: { echo } })
    expect(handle).not.toBe(false)
    dispatch(callMessage('echo', 42, 'onDone'), TRUSTED, peer)
    expect(echo).toHaveBeenCalledWith(42)
    expect(peer.postMessage).toHaveBeenCalledTimes(1)
    const [message, targetOrigin] = vi.mocked(peer.postMessage).mock.calls[0] as [
      Record<string, unknown>,
      string,
    ]
    expect(targetOrigin).toBe(TRUSTED)
    expect(message.crossDomain).toBe(true)
    expect(message.callFun).toBe('onDone')
    expect(message.arg).toBe(42)
  })

  it('调用抛错时不回执、不外泄', () => {
    const peer = { postMessage: vi.fn() } as unknown as Window
    handle = setupCrossDomain({
      allowOrigins: [TRUSTED],
      allowCalls: { boom: (): unknown => {
        throw new Error('boom')
      } },
    })
    expect(handle).not.toBe(false)
    expect(() => dispatch(callMessage('boom', 1, 'onDone'), TRUSTED, peer)).not.toThrow()
    expect(peer.postMessage).not.toHaveBeenCalled()
  })
})

describe('sendMessage', () => {
  it('向目标 window 投递协议消息，targetOrigin 取 setup 配置', () => {
    const postMessage = vi.fn()
    const target = { postMessage } as unknown as Window
    handle = setupCrossDomain({
      allowOrigins: [TRUSTED],
      allowCalls: {},
      targetOrigin: 'https://target.example',
    })
    expect(handle).not.toBe(false)
    sendMessage(target, 'remoteFn', { a: 1 }, 'onResult')
    expect(postMessage).toHaveBeenCalledTimes(1)
    const [message, targetOrigin] = vi.mocked(postMessage).mock.calls[0] as [
      Record<string, unknown>,
      string,
    ]
    expect(targetOrigin).toBe('https://target.example')
    expect(message.crossDomain).toBe(true)
    expect(message.call).toBe(true)
    expect(message.callFun).toBe('remoteFn')
    expect(message.arg).toEqual({ a: 1 })
    expect(message.callBackFun).toBe('onResult')
  })

  it('未配置 targetOrigin 时保底为 *（旧版默认）', () => {
    const postMessage = vi.fn()
    const target = { postMessage } as unknown as Window
    handle = setupCrossDomain({ allowOrigins: [TRUSTED], allowCalls: {} })
    expect(handle).not.toBe(false)
    sendMessage(target, 'fn', 'arg')
    const [, targetOrigin] = vi.mocked(postMessage).mock.calls[0] as [unknown, string]
    expect(targetOrigin).toBe('*')
  })

  it('字符串目标 id 不存在时静默跳过', () => {
    expect(() => sendMessage('no-such-iframe', 'fn', 'x')).not.toThrow()
  })
})
