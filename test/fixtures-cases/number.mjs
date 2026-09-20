/**
 * number 模块行为快照用例（锁定 v1 旧行为，供 2.0 TS 重写比对）
 * 覆盖 14 个方法：min max round ceil floor toNumber toNumberString toInteger
 * add subtract multiply divide cnMoneyFormat moneyFormat
 * 排除：random（随机）、commafy（将并入 moneyFormat）
 */
export default {
  module: 'number',
  methods: {
    min: [
      { args: [[5, 2, 8, 2]] },
      { args: [[3, 1, 4, 1, 5]] },
      { args: [[{ v: 3 }, { v: 1 }, { v: 2 }], (item) => item.v], note: '函数 iterate：返回的是原数组元素（对象），非数值' },
      { args: [[{ v: 3 }, { v: 1 }, { v: 2 }], 'v'], note: '字符串 iterate：按属性取最小元素' },
      { args: [[]], note: '空数组返回 undefined' },
      { args: [[null, 5, 2]], note: 'null 项被 eqNull 跳过，返回 2' },
    ],
    max: [
      { args: [[5, 2, 8]] },
      { args: [[-5, -2, -8]], note: '负数取最大（-2）' },
      { args: [[{ v: 3 }, { v: 1 }, { v: 2 }], 'v'], note: '字符串 iterate 返回元素对象' },
      { args: [[{ v: 3 }, { v: 9 }, { v: 2 }], (item) => item.v], note: '函数 iterate 返回元素对象' },
      { args: [[]], note: '空数组返回 undefined' },
    ],
    round: [
      { args: [3.14159, 2] },
      { args: [-3.5], note: 'Math.round 对 -3.5 进位到 -3（向 +Infinity 取半）' },
      { args: [1.005, 2], note: '浮点误差：1.005*100 = 100.4999…，结果为 1' },
      { args: [123.456, 1] },
      { args: [0], note: '0 为 falsy，helperCreateMathNumber 直接返回 0' },
      { args: ['abc'], note: 'toNumber 失败返回 0' },
    ],
    ceil: [
      { args: [4.2] },
      { args: [-4.2], note: '负数向上舍入为 -4' },
      { args: [0.123, 2] },
      { args: [6], note: '整数原样返回' },
      { args: ['7.8'], note: '字符串数字输入' },
    ],
    floor: [
      { args: [4.7] },
      { args: [-4.2], note: '负数向下舍入为 -5' },
      { args: [123.456, 2] },
      { args: [-0.5] },
      { args: [3], note: '整数原样返回' },
    ],
    toNumber: [
      { args: ['12.5abc'], note: 'parseFloat 截断前缀：12.5' },
      { args: ['  42'], note: '忽略前导空白' },
      { args: [''] },
      { args: ['abc'], note: '解析失败返回 0' },
      { args: [true], note: 'parseFloat(true) 为 NaN，返回 0' },
      { args: ['0x1F'], note: 'parseFloat 遇 x 停止，返回 0（对照 toInteger 返回 31）' },
    ],
    toNumberString: [
      { args: [123.456] },
      { args: [1e21], note: '科学计数展开为 1 后跟 21 个 0 的整数字符串' },
      { args: [1.2e-7], note: '负指数展开：0.00000012' },
      { args: [-1.5e-6], note: '负数负指数展开：-0.0000015' },
      { args: ['abc'], note: '非数字字符串原样返回' },
    ],
    toInteger: [
      { args: ['12.9'], note: '截断小数为 12（非四舍五入）' },
      { args: ['0x1F'], note: 'parseInt 识别 16 进制前缀，返回 31' },
      { args: ['  42px'], note: '忽略空白并截断后缀' },
      { args: ['abc'], note: '解析失败返回 0' },
      { args: [8.9] },
    ],
    add: [
      { args: [0.1, 0.2], note: '精度修正：精确得到 0.3' },
      { args: ['10', '5'], note: '字符串数字输入' },
      { args: [null, 5], note: 'null 经 toNumber 变 0' },
      { args: ['abc', 1], note: '非数字按 0 参与运算' },
      { args: [-0.3, 0.1], note: '负数精度：-0.2' },
    ],
    subtract: [
      { args: [0.3, 0.1], note: '精度修正：0.2' },
      { args: ['10', '3.55'] },
      { args: [-5, -3] },
      { args: ['abc', 5], note: '非数字按 0 参与：0-5 = -5' },
      { args: [1.1, 0.1], note: '结果 1（parseFloat 去掉尾零）' },
    ],
    multiply: [
      { args: [0.07, 100], note: '精度修正：7' },
      { args: [3, 0.3], note: '精度修正：0.9' },
      { args: ['2.5', '4'], note: '字符串数字输入' },
      { args: [0.1, 0.2], note: '精度修正：0.02' },
      { args: ['abc', 3], note: '非数字按 0 参与：0' },
    ],
    divide: [
      { args: [6, 3] },
      { args: [0.6, 0.2], note: '精度修正：3' },
      { args: [10, 4] },
      { args: [1, 0], note: '除以 0：内部 parseInt(Infinity) 为 NaN，返回 NaN（非 Infinity）' },
      { args: [1, 3], note: '除不尽：0.3333333333333333 原样返回' },
    ],
    cnMoneyFormat: [
      { args: [0], note: '零元整' },
      { args: [123.45], note: '壹佰贰拾叁元肆角伍分' },
      { args: [1001], note: '连续零折叠：壹仟零壹元整' },
      { args: [200000], note: '万位：贰万元整' },
      { args: ['88.5'], note: '字符串输入同样处理，尾零分不清理：捌拾捌元伍角零分' },
    ],
    moneyFormat: [
      { args: [1234567.891, 2] },
      { args: [1234567.891], note: '不传 decimal 按 0 位四舍五入：1,234,568' },
      { args: [-9876.5, 2], note: '负数千分位' },
      { args: [0], note: '已知 BUG：!money 把 0 当非法返回空串（2.0 修正并登记 override）' },
      { args: ['0'], note: '怪癖：字符串 0 不触发 !money，返回 "0"' },
      { args: [1234.5, 2, '￥'], note: '带货币前缀' },
    ],
  },
}
