/**
 * internal/config —— 默认配置（自 src/constant/setup/setupDefaults.js 移植）
 *
 * 2.0 破坏点：
 * - 旧字段名 axiosConfig 更名为 httpConfig（结构不变）。
 * - 旧版 setupDefaults 是可变单例（src/global/setup.js 通过 assign 原地合并）；
 *   2.0 改为不可变：setupDefaults 导出前深度冻结，setup() 浅合并生成新的冻结对象
 *   并替换模块内当前配置，通过 getSetup() 读取。
 * - 不做深合并：旧 setupDefaults 与 merge 的深合并语义在 M3 global 模块统一处理，
 *   此处保持简单（与旧 assign 的浅合并一致，传入的嵌套对象会被一并冻结）。
 */

/** 全局默认配置结构 */
export interface SparkUtilsSetup {
  /** 是否显示日志 */
  showLog: boolean
  /** 旧 axiosConfig，2.0 更名为 httpConfig */
  httpConfig: {
    /** 设置默认的请求地址 */
    baseURL: string
    /** 设置超时时间 */
    timeout: number
    /** 设置默认请求头 */
    headers: Record<string, string>
  }
  promiseResultConfig: {
    /** 结果数据 key */
    resultKey: string
    /** 验证配置 */
    verifyConfig: Record<string, unknown>
  }
  treeOptions: {
    parentKey: string
    key: string
    children: string
  }
  /** 默认日期解析格式（toStringDate） */
  formatDate: string
  /** 默认日期格式化输出（toDateString） */
  formatString: string
  /** getDateDiff 的默认换算规则（只读二元组：[规则名, 毫秒数]） */
  dateDiffRules: ReadonlyArray<readonly [string, number]>
  /**
   * cookie 写入的默认选项（M5 补齐：旧版 src/browser/cookie.js 读取 setupDefaults.cookies，
   * 但旧 setupDefaults 从未定义该字段，读取恒为 undefined，默认配置形同虚设）。
   * 每次写入时与传入项浅合并，项自身字段优先；可经 setup({ cookies: {...} }) 全量替换。
   */
  cookies: {
    /** 默认路径，缺省时由浏览器按当前页面路径处理 */
    path?: string
    /** 默认作用域 */
    domain?: string
    /** 默认是否仅 https 传输 */
    secure?: boolean
    /** 默认过期：天数 / 时间戳 / Date / '30d' 单位串（y M d H h m s） */
    expires?: string | number | Date
  }
}

/** 深度冻结：含嵌套对象与数组（元组按数组冻结），已冻结的跳过 */
function deepFreeze(target: unknown): void {
  if (target !== null && typeof target === 'object' && !Object.isFrozen(target)) {
    Object.freeze(target)
    for (const value of Object.values(target)) {
      deepFreeze(value)
    }
  }
}

const formatString = 'yyyy-MM-dd HH:mm:ss'

const defaults: SparkUtilsSetup = {
  showLog: true, // 是否显示日志
  httpConfig: {
    baseURL: '', // 设置默认的请求地址
    timeout: 10000, // 设置超时时间
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', // 设置默认的 Content-Type
    },
  },
  promiseResultConfig: {
    resultKey: 'data', // 结果数据key
    verifyConfig: {}, // 验证配置
  },
  treeOptions: {
    parentKey: 'parentId',
    key: 'id',
    children: 'children',
  },
  formatDate: formatString + '.SSSZ',
  formatString: formatString,
  dateDiffRules: [
    ['yyyy', 31536000000],
    ['MM', 2592000000],
    ['dd', 86400000],
    ['HH', 3600000],
    ['mm', 60000],
    ['ss', 1000],
    ['S', 0],
  ],
  // 旧版读取 setupDefaults.cookies 恒为 undefined（assign 静默跳过），
  // 2.0 显式补齐为空默认：不改变写入行为，但让 setup({ cookies }) 真正可配置
  cookies: {},
}

deepFreeze(defaults)

/** 默认配置（深度冻结，不可变；字段值与旧 setupDefaults 一致，仅 axiosConfig -> httpConfig） */
export const setupDefaults: Readonly<SparkUtilsSetup> = defaults

/** 模块内当前配置（setup() 替换，getSetup() 读取） */
let current: Readonly<SparkUtilsSetup> = setupDefaults

/**
 * 设置全局配置：浅合并生成新的冻结对象并替换当前配置
 * 嵌套层级整体替换（不做深合并），且传入的嵌套对象会被一并冻结。
 */
export function setup(options: Partial<SparkUtilsSetup>): Readonly<SparkUtilsSetup> {
  const merged: SparkUtilsSetup = { ...current, ...options }
  deepFreeze(merged)
  current = merged
  return current
}

/** 读取当前配置 */
export function getSetup(): Readonly<SparkUtilsSetup> {
  return current
}
