/**
 * fixtures 序列化协议的类型声明（实现见 serialize.mjs，生成器与比较器共用）
 */
export declare function normalize(value: unknown, seen?: WeakSet<object>): unknown
export declare function revive(normalized: unknown): unknown
export declare function deepClone<T>(value: T): T
