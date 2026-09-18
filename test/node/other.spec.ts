/**
 * other 模块测试（M5：TS 重写后行为锁定，node 环境）
 *
 * 覆盖：
 * - StateFlow：点路径嵌套读写、非点路径浅合并怪癖（原始值二次 set 得 {}）、
 *   action 函数触发与参数透传、destroy 单键/点路径/全清、构造器入参；
 * - promiseResultHandle：resolve 深取值与回调、verifyConfig 不通过、promise reject、
 *   路径断裂转「结果获取错误!」、无 promise 短路；
 * - 三个证件校验的 IDCardResult 新出参正反例（含旧版怪癖：澳门证裸竖线、
 *   香港证括号写法、二代证末位 X；与 fixtures 基线的差异为有意 API 变更，
 *   集成时在 test/overrides.json 登记）。
 *
 * 注意：'../../src/other/index.ts' 的显式 .ts 后缀是旧 .js 并存期
 * （Vite 解析优先命中 index.js）的临时方案，集成删除旧 .js 后还原为无后缀。
 */
import { describe, it, expect, vi } from 'vitest'
import {
  StateFlow,
  promiseResultHandle,
  validate2ndIdCard,
  hkIdVerify,
  macauIdCard,
} from '../../src/other/index'

describe('StateFlow', () => {
  it('构造器入参与点路径嵌套读写', () => {
    const flow = new StateFlow('theme', { dark: true })
    expect(flow.get('theme')).toEqual({ dark: true })
    flow.set('user.profile.name', '张三')
    expect(flow.get('user.profile.name')).toBe('张三')
    flow.set('user.profile.age', 18)
    // 同一中间容器被复用，兄弟键共存
    expect(flow.get('user.profile.age')).toBe(18)
    expect(flow.get('user.profile.name')).toBe('张三')
  })

  it('非点路径 set 的浅合并怪癖：原始值二次 set 得到空对象，对象则浅合并', () => {
    const flow = new StateFlow()
    flow.set('count', 1)
    expect(flow.get('count')).toBe(1)
    // 旧版 {...1, ...2} === {} 的怪癖忠实保留
    flow.set('count', 2)
    expect(flow.get('count')).toEqual({})
    flow.set('obj', { a: 1, b: 2 })
    flow.set('obj', { b: 3, c: 4 })
    expect(flow.get('obj')).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('action：触发挂载的函数并透传参数；非函数/不存在返回 undefined', () => {
    const flow = new StateFlow()
    flow.set('calc', (a: number, b: number) => a + b)
    expect(flow.action('calc', 20, 22)).toBe(42)
    flow.set('name', '张三')
    expect(flow.action('name')).toBeUndefined()
    expect(flow.action('missing')).toBeUndefined()
    expect(flow.get('')).toBeUndefined()
  })

  it('destroy：单键、点路径末级与全清（清空后仍可继续使用）', () => {
    const flow = new StateFlow()
    flow.set('a', 1)
    flow.set('user.name', '张三')
    flow.set('user.age', 18)
    flow.destroy('user.name')
    expect(flow.get('user.name')).toBeUndefined()
    expect(flow.get('user.age')).toBe(18)
    flow.destroy('a')
    expect(flow.get('a')).toBeUndefined()
    flow.destroy()
    expect(flow.get('user.age')).toBeUndefined()
    // 方法位于原型，全清后仍可写入
    flow.set('rebuilt', 'ok')
    expect(flow.get('rebuilt')).toBe('ok')
  })
})

describe('promiseResultHandle', () => {
  it('校验通过：按 resultKey 深取值返回，resolveFn 先于取值回调', async () => {
    const resolveFn = vi.fn()
    const rejectFn = vi.fn()
    const result = await promiseResultHandle({
      promise: Promise.resolve({ code: 0, data: { user: { name: '张三' } } }),
      resultKey: 'data.user.name',
      verifyConfig: { code: 0 },
      resolveFn,
      rejectFn,
    })
    expect(result).toBe('张三')
    expect(resolveFn).toHaveBeenCalledTimes(1)
    expect(rejectFn).not.toHaveBeenCalled()
  })

  it('校验不通过：reject「结果校验不通过!」并回调 rejectFn', async () => {
    const resolveFn = vi.fn()
    const rejectFn = vi.fn()
    await expect(
      promiseResultHandle({
        promise: Promise.resolve({ code: 1 }),
        verifyConfig: { code: 0 },
        resolveFn,
        rejectFn,
      }),
    ).rejects.toThrow('[spark-utils][promiseResultHandle]: 结果校验不通过!')
    expect(rejectFn).toHaveBeenCalledTimes(1)
    expect(resolveFn).not.toHaveBeenCalled()
  })

  it('promise reject 与路径断裂：统一转「结果获取错误!」并回调 rejectFn', async () => {
    const rejectFn = vi.fn()
    await expect(
      promiseResultHandle({ promise: Promise.reject(new Error('network')), rejectFn }),
    ).rejects.toThrow('[spark-utils][promiseResultHandle]: 结果获取错误!')
    // 路径断裂：undefined 继续取键抛 TypeError，被内部 catch 转为结果获取错误
    await expect(
      promiseResultHandle({
        promise: Promise.resolve({ data: {} }),
        resultKey: 'data.missing.deep',
        rejectFn,
      }),
    ).rejects.toThrow('[spark-utils][promiseResultHandle]: 结果获取错误!')
    expect(rejectFn).toHaveBeenCalledTimes(2)
  })

  it('无 promise 短路返回 undefined；默认 resultKey 取 setup 槽（data）', async () => {
    expect(await promiseResultHandle({})).toBeUndefined()
    const result = await promiseResultHandle({ promise: Promise.resolve({ data: [1, 2] }) })
    expect(result).toEqual([1, 2])
  })
})

describe('validate2ndIdCard（新出参 IDCardResult）', () => {
  it('正例：校验位 X 正确 → { valid: true }（无 code/msg）', () => {
    expect(validate2ndIdCard('11010519491231002X')).toEqual({ valid: true })
  })

  it('反例：长度不符 → LENGTH；校验位不符 → CHECKSUM', () => {
    expect(validate2ndIdCard('123456')).toEqual({
      valid: false,
      code: 'LENGTH',
      msg: '身份证长度不合法',
    })
    expect(validate2ndIdCard('110105194912310021')).toEqual({
      valid: false,
      code: 'CHECKSUM',
      msg: '身份证编码规则验证失败',
    })
  })

  it('undefined 入参与旧版一致：读取 length 抛 TypeError', () => {
    expect(() => validate2ndIdCard(undefined as unknown as string)).toThrowError(TypeError)
  })
})

describe('hkIdVerify（新出参 IDCardResult）', () => {
  it('正例：括号写法 / 双字母 / 无括号裸格式 → { valid: true }', () => {
    expect(hkIdVerify('A123456(3)')).toEqual({ valid: true })
    expect(hkIdVerify('AB123456(9)')).toEqual({ valid: true })
    expect(hkIdVerify('A1234563')).toEqual({ valid: true })
  })

  it('反例：校验位 / 长度 / 正则 各分支的 code 与 msg', () => {
    expect(hkIdVerify('A123456(0)')).toEqual({ valid: false, code: 'CHECKSUM', msg: '香港身份证验证失败' })
    expect(hkIdVerify('A12345')).toEqual({
      valid: false,
      code: 'LENGTH',
      msg: '身份证验证失败!长度小于8',
    })
    expect(hkIdVerify('12345678')).toEqual({
      valid: false,
      code: 'PATTERN',
      msg: '身份证验证失败!不满足正则表达式验证规则(^([A-Z]{1,2})([0-9]{6})([A0-9])$)',
    })
  })

  it('undefined 入参与旧版一致：读取 length 抛 TypeError', () => {
    expect(() => hkIdVerify(undefined as unknown as string)).toThrowError(TypeError)
  })
})

describe('macauIdCard（新出参 IDCardResult）', () => {
  it('正例：1/5/7 开头、字母校验位、裸竖线怪癖均通过', () => {
    expect(macauIdCard('12345678')).toEqual({ valid: true })
    expect(macauIdCard('56871234')).toEqual({ valid: true })
    expect(macauIdCard('7123456A')).toEqual({ valid: true })
    // 旧正则字符组 [1|5|7] 的裸竖线怪癖：'|' 开头也判合法
    expect(macauIdCard('|1234567')).toEqual({ valid: true })
  })

  it('反例：前缀/长度不符 → { valid: false, code: PATTERN }', () => {
    expect(macauIdCard('23456789')).toEqual({ valid: false, code: 'PATTERN', msg: '澳门身份证验证失败!' })
    expect(macauIdCard('12345')).toEqual({ valid: false, code: 'PATTERN', msg: '澳门身份证验证失败!' })
  })
})
