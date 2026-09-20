/**
 * spark-utils/pinyin 子入口：拼音转换
 *
 * 893 行拼音字典数据量大，独立分包避免拖累主包与 string 子入口。M3 里程碑落地。
 * 实现已迁移至 src/string/pinyin/（dict.ts 字典 + pinyin.ts 逻辑），此处仅
 * re-export 公共 API；pinyin 不进 src/string/index.ts（主包 string 入口
 * 不携带字典，需拼音能力请引 `spark-utils/pinyin` 子入口）。
 */
export { pinyin } from './string/pinyin/pinyin'
export type { PinyinConverter, PinyinOptions } from './string/pinyin/pinyin'
