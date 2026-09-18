/**
 * default 聚合对象（`import sparkUtils from 'spark-utils'`）
 *
 * 2.0 变更：不再包含旧版的 log/https/webStorage/crypto 嵌套命名空间——
 * 它们已拆为具名导出（log/createHttp/createWebStorage）与 `spark-utils/crypto`
 * 子入口；browser/pinyin 亦不在聚合内（各自子入口按需引入）。
 * 聚合仅由主包方法平铺组成（不含 VERSION/setupDefaults 常量，保持 1.x
 * 纯方法对象形状），键集合与主入口具名导出一致（由 test/contracts 快照共同约束）。
 */
import { setup } from './config'
import * as basic from './basic/index'
import * as array from './array/index'
import * as number from './number/index'
import * as string from './string/index'
import * as object from './object/index'
import * as functionModule from './function/index'
import * as http from './http/index'
import * as other from './other/index'
import * as date from './date/index'

/** 旧版 default 用法兼容对象：SparkUtils.debounce(...) / sparkUtils.uniq(...) */
const sparkUtils = {
  setup,
  ...basic,
  ...array,
  ...number,
  ...string,
  ...object,
  ...functionModule,
  ...http,
  ...other,
  ...date,
}

export default sparkUtils
