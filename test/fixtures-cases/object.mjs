/**
 * object 模块行为快照用例（锁定 v1 旧实现行为，供 2.0 TS 重写对照）
 *
 * 格式：{ args: [...args], note?: '说明' }
 * - 内联函数必须自包含（生成器按 toString 序列化，无法还原闭包）；this 仅配合 context 参数使用
 * - set/clear/assign/destructuring 为原地变异：生成器每次调用前深克隆参数，输出即变异后结果，安全
 * - 旧实现的怪癖行为（默认值不覆盖 null / 深拷贝模式整键替换 / 原型污染键忽略等）均按原样记录
 */
export default {
  module: 'object',
  methods: {
    has: [
      { args: [{ a: 1 }, 'a'], note: '自有键直接 hasOwnProperty 命中，true' },
      { args: [{ a: { b: 1 } }, 'a.b'], note: '点路径逐级判定，true' },
      { args: [{ a: [10, 20] }, 'a[1]'], note: '索引路径（正则要求 [数字] 在末尾），true' },
      { args: [{ a: undefined }, 'a'], note: '怪癖：值为 undefined 的自有键仍算存在，true' },
      { args: [{}, 'a'], note: '不存在 false' },
      { args: [null, 'a'], note: '空对象入参 false' },
    ],
    get: [
      { args: [{ a: { b: 2 } }, 'a.b'], note: '点路径取值 2' },
      { args: [{ list: [10, 20] }, 'list[1]'], note: '索引路径取值 20' },
      { args: [null, 'a', 'D'], note: 'eqNull 入参直接返回默认值 "D"' },
      { args: [{}, 'x', 'D'], note: '取不到返回默认值 "D"' },
      { args: [{ a: null }, 'a', 'D'], note: '怪癖：值为 null 时直接返回 null，不走默认值（仅 undefined 才走）' },
      { args: [{ a: 0 }, 'a', 'D'], note: '怪癖：falsy 但自有属性存在，返回 0 而非默认值' },
    ],
    set: [
      { args: [{}, 'a', 1], note: '简单键设置 {a:1}' },
      { args: [{}, 'a.b', 2], note: '路径自动创建中间对象 {a:{b:2}}' },
      { args: [{ a: {} }, 'a.b', 3], note: '已有中间对象复用 {a:{b:3}}' },
      { args: [{}, 'list[0]', 'x'], note: '索引路径自动建数组 {list:["x"]}' },
      { args: [{ a: 1 }, 'a', 9], note: '覆盖已有键 {a:9}，返回原对象' },
      { args: [{}, '__proto__', 'x'], note: '原型污染键被黑名单忽略，返回 {}（安全行为）' },
    ],
    clear: [
      { args: [{ a: 1, b: 2 }], note: '不传默认值删除全部属性得 {}' },
      { args: [{ a: 1, b: 2 }, 0], note: '标量默认值逐键填充 {a:0,b:0}' },
      { args: [{ a: 1 }, { b: 2 }], note: '对象默认值=清空并继承 {b:2}' },
      { args: [[1, 2, 3]], note: '数组清空得 []' },
      { args: [[1, 2], 'x'], note: '数组标量填充 ["x","x"]' },
      { args: [null], note: '空入参原样返回 null' },
    ],
    assign: [
      { args: [{ a: 1 }, { b: 2 }], note: '浅合并 {a:1,b:2}' },
      { args: [{ a: 1 }, { a: 2, b: 3 }], note: '后者覆盖 {a:2,b:3}' },
      { args: [true, { a: { b: 1 } }, { a: { c: 2 } }], note: '怪癖：首参 true 走深拷贝模式，但整键替换而非递归合并，得 {a:{c:2}}' },
      { args: [{ a: 1 }, null], note: '空源跳过 {a:1}' },
      { args: [null], note: '空目标原样返回 null' },
    ],
    merge: [
      { args: [{ a: { b: 1 } }, { a: { c: 2 } }], note: '深合并 {a:{b:1,c:2}}' },
      { args: [{ a: 1, b: 2 }, { b: 3 }], note: '浅键覆盖 {a:1,b:3}' },
      { args: [[1, 2], [3]], note: '数组按索引合并 [3,2]' },
      { args: [null, { a: 1 }], note: 'null 目标初始化为 {} 再合并 {a:1}' },
      { args: [{ a: 1 }, null], note: '空源跳过 {a:1}' },
      { args: [{}, { a: [1, 2] }], note: '无同名键直接引用源值 {a:[1,2]}' },
    ],
    clone: [
      { args: [{ a: 1, b: { c: 2 } }], note: '浅拷贝（嵌套引用不可区分，快照锁定形状）' },
      { args: [{ a: { b: { c: 3 } } }, true], note: '深拷贝普通对象' },
      { args: [[1, [2, 3]]], note: '浅拷贝数组' },
      { args: [[1, [2, 3]], true], note: '深拷贝数组' },
      { args: [{ d: new Date('2024-03-05T08:30:00Z') }, true], note: '深拷贝 Date（new Ctor(valueOf())，时刻不变）' },
      { args: [null], note: '空值原样返回 null' },
    ],
    destructuring: [
      { args: [{ a: 1, b: 2 }, { b: 3 }], note: '仅覆盖与源相交的键 {a:1,b:3}' },
      { args: [{ a: 1 }, { c: 4 }], note: '无交集不变 {a:1}' },
      { args: [{ a: 1, b: 2 }, { a: 10 }, { b: 20 }], note: '多源按序覆盖 {a:10,b:20}' },
      { args: [null, { a: 1 }], note: '空目标原样返回 null' },
      { args: [{ a: 1 }, null], note: '怪癖：第二参 falsy 时整体跳过，返回原对象 {a:1}' },
    ],
    objectEach: [
      { args: [{ a: 1, b: 2 }, function (v, k) { return k + v }], note: 'for-in 自有键遍历，返回 undefined' },
      { args: [{ a: 1 }, function (v) { return this.tag }, { tag: 'x' }], note: 'context 绑定 this（副作用不可见，仅锁定返回值 undefined）' },
      { args: [{}, function (v) { return v }], note: '空对象返回 undefined' },
      { args: [null, function (v) { return v }], note: '空值不遍历不抛错，返回 undefined' },
    ],
    lastObjectEach: [
      { args: [{ a: 1, b: 2 }, function (v, k) { return v }], note: '按 keys 倒序遍历，返回 undefined' },
      { args: [{}, function (v) { return v }], note: '空对象返回 undefined' },
      { args: [null, function (v) { return v }], note: 'keys(null) 为空数组，不抛错返回 undefined' },
    ],
    objectMap: [
      { args: [{ a: 1, b: 2 }, function (v) { return v * 2 }], note: '值映射 {a:2,b:4}' },
      { args: [{ a: 1 }, function (v) { return this.base + v }, { base: 10 }], note: 'context 绑定 {a:11}' },
      { args: [[{ n: 'x' }, { n: 'y' }], 'n'], note: '属性名 iterate：数组按索引成键 {0:"x",1:"y"}' },
      { args: [{ a: 1, b: 2 }, 'miss'], note: '怪癖：属性名不存在时键保留、值为 undefined' },
      { args: [{ a: 1 }], note: '怪癖：不传 iterate 原样返回入参对象 {a:1}' },
      { args: [null, function (v) { return v }], note: '空入参返回 {}' },
    ],
    pick: [
      { args: [{ a: 1, b: 2, c: 3 }, 'a', 'c'], note: '多键字符串参数 {a:1,c:3}' },
      { args: [{ a: 1, b: 2 }, ['b']], note: '键数组参数 {b:2}' },
      { args: [{ a: 1, b: 2, c: 3 }, function (v, k) { return k !== 'b' }], note: '函数筛选 {a:1,c:3}' },
      { args: [{ a: 1 }, 'missing'], note: '无命中键 {}' },
      { args: [null, 'a'], note: '空入参 {}' },
    ],
    omit: [
      { args: [{ a: 1, b: 2, c: 3 }, 'b'], note: '排除单键 {a:1,c:3}' },
      { args: [{ a: 1, b: 2 }, ['a', 'b']], note: '全部排除得 {}' },
      { args: [{ a: 1, b: 2, c: 3 }, function (v, k) { return k === 'b' }], note: '函数筛选排除 {a:1,c:3}' },
      { args: [{ a: 1, b: 2 }, 'missing'], note: '未命中键原样保留 {a:1,b:2}' },
      { args: [null, 'a'], note: '空入参 {}' },
    ],
  },
}
