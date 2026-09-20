/**
 * browser/storage —— webStorage 命名空间（M5：TS 重写 + 实例级缓存）
 *
 * 设计说明：
 * - 一个 WebStorageCreator 实例对应底层 Storage（localStorage/sessionStorage）的
 *   一个键，键值为 JSON 序列化的 { key: JSON.stringify(值|包装) } 映射，
 *   invalidTime !== -1 时值包装为 { value, updateTime }，读取时惰性过期。
 * - 性能改造（2.0）：旧版 get/set/remove 每次都 JSON.parse 整个原始串（get 内部
 *   还要再 parse 一次条目），高频读写下开销线性放大；新版引入实例级缓存：
 *   缓存「原始串 + 解析结果」，自身写/删直接改缓存并回写（脏标记清零），
 *   读操作以 O(1) 的原始串比对兜底——其它实例或页面同键写入导致原始串变化时
 *   自动重新解析，跨实例一致性不受影响。
 * - bug 修复（2.0）：旧版 getStorage 在 createWebStorage 返回 false 时仍然继续
 *   调用 webStorage.getAll()，直接 TypeError；新版失败时返回 null。
 * - bug 修复（2.0）：带 invalidTime 的实例读到「非包装条目」（普通实例或外部
 *   写入的同键数据）时，旧实现把 undefined 当 updateTime 参与运算（NaN 恒不过期）
 *   并把 undefined 重新包装回写，静默损毁存量数据；新实现三态解析条目
 *   （corrupt / plain / wrapped），plain 数据原样返回且永不被过期实例改写，
 *   损坏 JSON 条目按缺失处理并告警，不再裸抛 SyntaxError；反向混读（永不过期
 *   实例读到包装条目）旧版返回整个 {value, updateTime} 壳，新版解包返回真实值，
 *   跨实例读写两个方向语义一致。
 * - 移除（2.0）：已弃用的 init 别名（旧版仅打 deprecation 日志后转发）。
 * - 日志经 getSetup().showLog 门控（旧版无条件 console.log）。
 */
import { getSetup } from '../internal/config'
import { getWindow } from '../internal/env'

/** createWebStorage 初始化选项 */
export interface WebStorageOptions {
  /** true 使用 localStorage，false（默认）使用 sessionStorage */
  isLocal?: boolean
  /** 失效时间（秒），-1（默认）表示永不过期 */
  invalidTime?: number
}

/** invalidTime !== -1 时的存储包装 */
interface StorageRecord {
  value: unknown
  updateTime: number
}

/** 条目解析三态：corrupt=损坏 JSON；plain=非本实例包装的外部数据；wrapped=过期实例管辖的包装条目 */
type ParsedEntry =
  | { kind: 'corrupt' }
  | { kind: 'plain'; record: unknown }
  | { kind: 'wrapped'; wrapped: StorageRecord }

/** webStorage 实例（createWebStorage 的返回类型；false 代表创建失败） */
export interface WebStorageCreator {
  /** 读取指定 key；未初始化/不存在/已过期返回 null（过期键会被顺带删除） */
  get(key: string): unknown
  /** 读取整个映射（值为序列化前的原始 JSON 字符串）；未初始化返回 null */
  getAll(): Record<string, unknown> | null
  /** 全部 key */
  getAllKeys(): string[]
  /** 写入指定 key */
  set(key: string, value: unknown): void
  /** 删除指定 key；未初始化返回 false（旧版返回 undefined，2.0 归一化为 boolean） */
  remove(key: string): boolean
  /** 删除整个存储键 */
  removeData(): void
  /** 清理全部已过期的键（invalidTime 为 -1 时为空操作） */
  cleanFailureData(): void
}

/** 默认存储键名（旧版同名默认值） */
const DEFAULT_STORAGE_NAME = 'SPARK$webstorage'

/** 日志经 showLog 门控 */
function warnLog(message: string): void {
  if (getSetup().showLog) {
    console.warn(`[spark-utils]: ${message}`)
  }
}

class WebStorageCreatorImpl implements WebStorageCreator {
  private readonly storage: Storage
  private readonly storageName: string
  private readonly invalidTime: number
  /** 实例级缓存：原始串 + 解析结果 */
  private cacheRaw: string | null = null
  private cacheMap: Record<string, string> = {}
  /** 脏标记：自身 removeData 置脏；写操作经 commit 直接清零 */
  private dirty = true

  constructor(storage: Storage, storageName: string, invalidTime: number) {
    this.storage = storage
    this.storageName = storageName
    this.invalidTime = invalidTime
    this.initData()
  }

  /** 读取底层原始串；命中缓存（未脏且原始串未变）时跳过 JSON.parse */
  private readMap(): Record<string, string> | null {
    const raw = this.storage.getItem(this.storageName)
    if (raw === null) {
      return null
    }
    if (this.dirty || raw !== this.cacheRaw) {
      this.cacheMap = JSON.parse(raw) as Record<string, string>
      this.cacheRaw = raw
      this.dirty = false
    }
    return this.cacheMap
  }

  /** 回写底层并同步缓存（自身写路径，无需再比对） */
  private commit(map: Record<string, string>): void {
    const raw = JSON.stringify(map)
    this.storage.setItem(this.storageName, raw)
    this.cacheMap = map
    this.cacheRaw = raw
    this.dirty = false
  }

  private initData(): void {
    if (this.storage.getItem(this.storageName) !== null) {
      return
    }
    this.commit({})
  }

  /**
   * 条目三态解析：损坏 JSON / 非包装数据（普通实例或外部写入）/ 本实例管辖的包装条目。
   * 仅「对象且 updateTime 为数字」按包装处理——其余一律视为 plain，
   * 保证过期实例读外部数据时原样返回、不回写不删除（不再静默损毁）。
   */
  private parseEntry(entry: string): ParsedEntry {
    let record: unknown
    try {
      record = JSON.parse(entry)
    } catch {
      return { kind: 'corrupt' }
    }
    if (
      record !== null &&
      typeof record === 'object' &&
      typeof (record as StorageRecord).updateTime === 'number'
    ) {
      return { kind: 'wrapped', wrapped: record as StorageRecord }
    }
    return { kind: 'plain', record }
  }

  get(key: string): unknown {
    const map = this.readMap()
    if (map === null) {
      warnLog(`webStorage "${this.storageName}" 的 ${key}: 尚未初始化;`)
      return null
    }
    const entry = map[key]
    if (!entry) {
      return null
    }
    const parsed = this.parseEntry(entry)
    if (parsed.kind === 'corrupt') {
      warnLog(`webStorage "${this.storageName}" 的 ${key}: 条目损坏，按缺失处理`)
      return null
    }
    if (parsed.kind === 'plain') {
      return parsed.record === null || parsed.record === undefined ? null : parsed.record
    }
    if (this.invalidTime === -1) {
      // 永不过期实例读到包装条目：解包返回，不刷新不回写
      return parsed.wrapped.value
    }
    const seconds = (Date.now() - parsed.wrapped.updateTime) / 1000
    if (seconds > this.invalidTime) {
      this.remove(key)
      return null
    }
    // 命中即刷新使用时间（旧版语义）。2.0 读放大收口：旧路径经 this.set
    // 会再次 readMap（又一次同步 getItem），改为就地更新缓存条目后回写，
    // 单次 get 由「2 读 + 1 写」降为「1 读 + 1 写」；写放大（整映射重序列化）
    // 由单键存储格式决定，无法避免
    map[key] = JSON.stringify({
      value: parsed.wrapped.value,
      updateTime: Date.now(),
    } satisfies StorageRecord)
    this.commit(map)
    return parsed.wrapped.value
  }

  getAll(): Record<string, unknown> | null {
    const map = this.readMap()
    // 返回浅拷贝，避免调用方污染实例缓存
    return map === null ? null : { ...map }
  }

  getAllKeys(): string[] {
    return Object.keys(this.readMap() ?? {})
  }

  set(key: string, value: unknown): void {
    const map = this.readMap()
    if (map === null) {
      warnLog('webStorage 未初始化')
      return
    }
    map[key] =
      this.invalidTime !== -1
        ? JSON.stringify({ value, updateTime: Date.now() } satisfies StorageRecord)
        : JSON.stringify(value)
    this.commit(map)
  }

  remove(key: string): boolean {
    const map = this.readMap()
    if (map === null) {
      return false
    }
    delete map[key]
    this.commit(map)
    return true
  }

  removeData(): void {
    this.storage.removeItem(this.storageName)
    this.cacheRaw = null
    this.cacheMap = {}
    this.dirty = true
  }

  cleanFailureData(): void {
    if (this.invalidTime === -1) {
      return
    }
    const map = this.readMap()
    if (map === null) {
      return
    }
    // 迭代键快照：remove 会原地变更映射
    for (const key of Object.keys({ ...map })) {
      const entry = map[key]
      if (!entry) {
        continue
      }
      const parsed = this.parseEntry(entry)
      // plain/corrupt 条目不属于本实例管辖，clean 不动它们
      if (parsed.kind !== 'wrapped') {
        continue
      }
      const seconds = (Date.now() - parsed.wrapped.updateTime) / 1000
      if (seconds > this.invalidTime) {
        this.remove(key)
      }
    }
  }
}

/**
 * 创建一个 webStorage 实例
 * @param name 底层存储键名，默认 'SPARK$webstorage'
 * @param options 初始化选项（isLocal / invalidTime）
 * @returns 实例；浏览器环境缺失或 invalidTime 非数字时返回 false（忠实旧版）
 */
export function createWebStorage(name?: string, options?: WebStorageOptions): WebStorageCreator | false {
  const win = getWindow() as Window | undefined
  if (!win) {
    return false
  }
  const isLocal = options?.isLocal ?? false
  const invalidTime = options?.invalidTime ?? -1
  const storage = isLocal ? win.localStorage : win.sessionStorage
  if (!storage) {
    warnLog(isLocal ? '浏览器暂不支持 localstorage' : '浏览器暂不支持 sessionStorage')
    return false
  }
  if (Number.isNaN(invalidTime)) {
    warnLog('失效时间只支持数字')
    return false
  }
  return new WebStorageCreatorImpl(storage, name ?? DEFAULT_STORAGE_NAME, invalidTime)
}

/**
 * 快速读取指定存储键下的某个值（不传 storageKey 返回整个映射）
 * @param storageName 存储名称
 * @param storageKey 键；缺省读取全部
 * @param isLocal 是否 localStorage
 */
export function getStorage(storageName: string, storageKey?: string, isLocal = false): unknown {
  const webStorageInstance = createWebStorage(storageName, { isLocal })
  if (webStorageInstance === false) {
    // 修复旧版：此处继续调用 .getAll() 会 TypeError
    warnLog('创建 WebStorages 失败!')
    return null
  }
  if (storageKey === undefined) {
    return webStorageInstance.getAll()
  }
  return webStorageInstance.get(storageKey)
}

/** webStorage 命名空间（createWebStorage / getStorage 聚合） */
export const webStorage: {
  createWebStorage: typeof createWebStorage
  getStorage: typeof getStorage
} = {
  createWebStorage,
  getStorage,
}
