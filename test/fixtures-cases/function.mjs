/**
 * function 模块行为快照用例（锁定 v1 旧实现行为，供 2.0 TS 重写对照）
 *
 * 说明：once/after/before 返回包装函数，生成器只调用一层、无法观察包装函数的执行结果，
 * 这里仅记录"返回值为 Function"以锁定方法签名（含额外参数的位置语义）。
 * bind/delay/throttle/debounce/loop 已列入删除/异步计时类，不做快照。
 */
export default {
  module: 'function',
  methods: {
    noop: [
      { args: [], note: '无参调用返回 undefined' },
      { args: [1, 'a', { x: 1 }], note: '任意参数均原样忽略，返回 undefined' },
    ],
    once: [
      { args: [function () { return 42 }], note: '返回只执行一次的包装函数' },
      { args: [function (a, b) { return a + b }, null, 3], note: '第二参 context、其余参数作为前置附加参数' },
    ],
    after: [
      { args: [2, function (rests, arg) { return 'done:' + arg }], note: '调用达到 count 次后才执行回调，返回包装函数' },
      { args: [0, function (rests) { return rests.length }], note: 'count 0 时首次调用即满足条件' },
    ],
    before: [
      { args: [3, function (rests) { return rests.length }], note: '调用未达 count 次前执行回调，返回包装函数' },
      { args: [0, function (rests) { return 'x' }], note: 'count 0 时永不执行回调' },
    ],
  },
}
