/**
 * StateFlow —— 数据状态流（移植自旧 src/other/stateFlow.js）
 *
 * 实例本身即存储容器（this 上动态挂键，以索引签名建模），支持点路径读写嵌套。
 * 行为（含怪癖）忠实保留：
 * - 非点路径 set：键已存在时做 { ...旧值, ...新值 } 浅合并——旧值为原始值时展开为空对象，
 *   即 set('k', 1) 后再 set('k', 2) 得到 {}（旧版即如此）；
 * - 点路径 set：逐级创建中间对象（已有则沿用，原始值沿用原始值——后续在其上继续设键
 *   会在严格模式下抛 TypeError，与旧版 ESM 行为一致）；
 * - get：路径中途为假值时返回 undefined；空键返回 undefined；
 * - action：取到的值为函数才调用并透传参数，否则返回 undefined；
 * - destroy：无参清空全部自有数据键（原型方法不受影响）；有参删单键/点路径末级键。
 *
 * 适配说明：旧版 Object.hasOwn（ES2022）超出主包 lib（ES2020），改用等价的
 * internal/type 的 hasOwnProp（Object.prototype.hasOwnProperty 语义）。
 */
import { hasOwnProp } from '../internal/type'

/** 数据状态流：以实例为容器的键值状态管理（支持点路径） */
export class StateFlow {
  /** 实例即存储容器：任意数据键动态挂载（方法位于原型，不受影响） */
  [key: string]: unknown

  constructor(k?: string, v?: unknown) {
    if (k) {
      this.set(k, v)
    }
  }

  /** 设置状态：点路径逐级创建并设末级；非点路径对已有键做浅合并 */
  set(k: string, v: unknown): void {
    if (!k) {
      return
    }
    if (k.includes('.')) {
      const segments = k.split('.')
      const last = segments[segments.length - 1] ?? ''
      const target = segments.slice(0, -1).reduce<Record<string, unknown>>(
        (pre, cur) => {
          pre[cur] = hasOwnProp(pre, cur) ? pre[cur] : {}
          return pre[cur] as Record<string, unknown>
        },
        this as unknown as Record<string, unknown>,
      )
      if (target) {
        target[last] = v
      }
    } else {
      this[k] = hasOwnProp(this, k) ? { ...(this[k] as object), ...(v as object) } : v
    }
  }

  /** 读取状态：点路径逐级取值，中途假值或空键返回 undefined */
  get(k: string): unknown {
    if (!k) {
      return
    }
    if (k.includes('.')) {
      const segments = k.split('.')
      // 与旧版 reduce 等价：自 this 起逐级取到末级前一站（首段显式取出，避免 this 别名）
      let target: unknown = (this as unknown as Record<string, unknown>)[segments[0] as string]
      for (const key of segments.slice(1, -1)) {
        target = (target as Record<string, unknown>)[key]
      }
      if (!target) {
        return
      }
      return (target as Record<string, unknown>)[segments[segments.length - 1] as string]
    }
    return this[k]
  }

  /** 触发状态中挂载的函数（透传参数）；非函数或不存在的键返回 undefined */
  action(k: string, ...args: unknown[]): unknown {
    const fn = this.get(k)
    if (typeof fn === 'function') {
      return (fn as (...fnArgs: unknown[]) => unknown)(...args)
    }
    return
  }

  /** 销毁：无参清空全部自有数据键；有参删除指定键（支持点路径末级） */
  destroy(k?: string): void {
    if (k) {
      if (k.includes('.')) {
        const segments = k.split('.')
        // 与旧版 reduce 等价：自 this 起逐级取到末级前一站（首段显式取出，避免 this 别名）
        let target: unknown = (this as unknown as Record<string, unknown>)[segments[0] as string]
        for (const key of segments.slice(1, -1)) {
          target = (target as Record<string, unknown>)[key]
        }
        if (target) {
          delete (target as Record<string, unknown>)[segments[segments.length - 1] as string]
        }
      } else if (this[k]) {
        delete this[k]
      }
    } else {
      for (const key of Object.keys(this)) {
        delete this[key]
      }
    }
  }
}
