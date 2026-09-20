/**
 * default 聚合不变式：default 对象（`import sparkUtils from 'spark-utils'` / UMD 全局）
 * 与主入口具名导出必须始终一致——
 * - 键集合：主入口具名导出 − { VERSION, setupDefaults, default }（default 聚合
 *   保持 1.x 纯方法对象形状，不含常量与 default 自引用）；
 * - 逐键全等：default 的每个键与主入口同名导出 ===（聚合是引用平铺，不是拷贝）。
 *
 * 与 exports-snapshot.json 互补：快照锁定「主入口导出什么」，本测试锁定
 * 「default 聚合与主入口不漂移」。
 */
import { describe, it, expect } from 'vitest'
import * as index from '../../src/index'
import sparkUtils from '../../src/default'

describe('default 聚合不变式', () => {
  const indexKeys = Object.keys(index)
    .filter((key) => key !== 'VERSION' && key !== 'setupDefaults' && key !== 'default')
    .sort()

  it('default 键集合 === 主入口具名导出 − { VERSION, setupDefaults, default }', () => {
    expect(Object.keys(sparkUtils).sort()).toEqual(indexKeys)
  })

  it('default 每个键与主入口同名导出全等（===）', () => {
    for (const key of Object.keys(sparkUtils)) {
      expect(sparkUtils[key as keyof typeof sparkUtils]).toBe(index[key as keyof typeof index])
    }
  })
})
