/**
 * array 模块行为快照用例（锁定 v1 旧实现行为，供 2.0 TS 重写对照）
 *
 * 格式：{ args: [...args], note?: '说明' }
 * - 内联函数必须自包含（生成器按 toString 序列化，无法还原闭包）
 * - 旧实现的怪癖行为（返回 undefined / NaN / 抛错 / 键名强转）均按原样记录
 * - remove/toArrayTree(strict)/toTreeArray(clear) 为原地变异：生成器每次调用前深克隆参数，安全
 */
export default {
  module: 'array',
  methods: {
    arrayEach: [
      { args: [[1, 2, 3], function (v, i) { return v * i }], note: '典型遍历，走原生 forEach，返回 undefined' },
      { args: [null, function (v) { return v }], note: 'null 入参不遍历不抛错' },
      { args: ['abc', function (c) { return c.toUpperCase() }], note: '字符串无 forEach，走索引循环' },
    ],
    lastArrayEach: [
      { args: [[1, 2, 3], function (v, i) { return v + i }], note: '倒序遍历，返回 undefined' },
      { args: [[], function (v) { return v }], note: '空数组' },
      { args: [null, function (v) { return v }], note: 'null 直接读 length 抛错（无空值保护）' },
    ],
    findIndexOf: [
      { args: [[10, 20, 30, 20], function (v) { return v === 20 }], note: '返回首个命中索引' },
      { args: [[1, 2, 3], function (v) { return v > 10 }], note: '未命中返回 -1' },
      { args: [{ a: 5, b: 3, c: 1 }, function (v) { return v < 4 }], note: '对象入参 for-in 返回键名' },
      { args: [[1, 2, 3], 'x'], note: '非函数 iterate 直接返回 -1' },
    ],
    findLastIndexOf: [
      { args: [[10, 20, 30, 20], function (v) { return v === 20 }], note: '返回最后命中索引 3' },
      { args: [[1, 2, 3], function (v) { return v > 10 }], note: '未命中返回 -1' },
      { args: [{ a: 5, b: 3, c: 1 }, function (v) { return v < 4 }], note: '对象入参仍正序 for-in，与 findIndexOf 结果相同（怪癖）' },
    ],
    find: [
      { args: [[1, 2, 3, 4], function (v) { return v > 2 }], note: '数组走原生 find' },
      { args: [[1, 2], function (v) { return v > 9 }], note: '未命中返回 undefined' },
      { args: [{ a: 1, b: 2 }, function (v) { return v === 2 }], note: '对象 for-in 返回匹配值' },
      { args: [[1, 2], 'x'], note: '非函数 iterate 原生 find 抛错' },
    ],
    findKey: [
      { args: [{ a: 1, b: 2 }, function (v) { return v === 2 }], note: '返回命中键名' },
      { args: [[10, 20, 30], function (v) { return v >= 20 }], note: '数组入参也走 for-in，返回字符串索引 "1"（怪癖）' },
      { args: [{ a: 1 }, function (v) { return v === 9 }], note: '未命中返回 undefined' },
    ],
    remove: [
      { args: [[1, 2, 3, 4], function (v) { return v > 2 }], note: '返回被移除元素组成的数组，倒序收集得 [4,3]（怪癖）' },
      { args: [[1, 2, 3]], note: '无 iterate 走 clear，返回空数组' },
      { args: [{ a: 1, b: 2, c: 3 }, function (v, k) { return k !== 'a' }], note: '对象返回被移除键值对象' },
      { args: [{ a: 1, b: 2 }, 'a'], note: '字符串属性名按对象键名匹配' },
      { args: [null, function (v) { return true }], note: 'null 原样返回' },
    ],
    orderBy: [
      { args: [[3, 1, 2]], note: '无 fieldConfs 按值升序' },
      { args: [[{ age: 25 }, { age: 10 }, { age: 40 }], 'age'], note: '字符串属性升序' },
      { args: [[{ age: 25 }, { age: 10 }], [['age', 'desc']]], note: '数组配置 desc' },
      { args: [[{ age: 25 }, { age: 10 }], [{ field: 'age', order: 'desc' }]], note: '对象配置 desc' },
      { args: [[3, 1, 2], function (v) { return -v }], note: '函数 iterate 按计算值排序（反向）' },
      { args: [null], note: 'null 返回 []' },
    ],
    some: [
      { args: [[1, 2, 3], function (v) { return v > 2 }], note: '任一命中返回 true（原生 some）' },
      { args: [[1, 2, 3], function (v) { return v > 9 }], note: '全不命中返回 false' },
      { args: [{ a: 1, b: 2 }, function (v) { return v > 1 }], note: '对象 for-in 命中返回 true' },
      { args: [null, function (v) { return true }], note: 'null 返回默认 false' },
    ],
    every: [
      { args: [[2, 4, 6], function (v) { return v % 2 === 0 }], note: '全部满足返回 true（原生 every）' },
      { args: [[2, 3], function (v) { return v % 2 === 0 }], note: '任一不满足返回 false' },
      { args: [{ a: 2, b: 4 }, function (v) { return v % 2 === 0 }], note: '对象 for-in 全满足返回 true' },
      { args: [null, function (v) { return false }], note: 'null 返回默认 true' },
    ],
    filter: [
      { args: [[1, 2, 3, 4], function (v) { return v % 2 === 0 }], note: '原生 filter' },
      { args: [[], function (v) { return true }], note: '空数组返回 []' },
      { args: [{ a: 1, b: 2, c: 3 }, function (v) { return v > 1 }], note: '对象入参返回值数组' },
      { args: [[1, 2], null], note: 'iterate 为空返回 []' },
    ],
    map: [
      { args: [[1, 2, 3], function (v) { return v * 2 }], note: '原生 map' },
      { args: [{ a: 1, b: 2 }, function (v, k) { return k + v }], note: '对象映射值数组' },
      { args: [[1, 2, 3]], note: '缺 iterate 返回 []' },
      { args: [null, function (v) { return v }], note: 'null 返回 []' },
      { args: ['abc', function (c) { return c.toUpperCase() }], note: '字符串逐字符映射（无原生 map，走 each）' },
    ],
    sum: [
      { args: [[1, 2, 3]], note: '基础求和' },
      { args: [[]], note: '空数组返回 0' },
      { args: [[{ n: 1 }, { n: 2 }, { n: 3 }], 'n'], note: '属性名 iterate' },
      { args: [[0.1, 0.2]], note: '浮点精度修正应得 0.3' },
      { args: [[1, 'a', 3]], note: '非数字项经 toNumber 按 0 计入，结果 4（怪癖）' },
    ],
    mean: [
      { args: [[1, 2, 3]], note: '基础均值' },
      { args: [[{ v: 2 }, { v: 4 }], 'v'], note: '属性名 iterate' },
      { args: [[]], note: '空数组 0/0 经 divide 得 0（怪癖）' },
      { args: [[1, 'a']], note: '非数字项按 0 计入但占分母，结果 0.5（怪癖）' },
    ],
    toArray: [
      { args: [[1, 2, 3]], note: '返回新数组' },
      { args: [{ a: 1, b: 2 }], note: '对象取值数组' },
      { args: ['abc'], note: '字符串拆成字符数组' },
      { args: [null], note: 'null 返回 []' },
    ],
    reduce: [
      { args: [[1, 2, 3, 4], function (prev, cur) { return prev + cur }], note: 'callback(prev, cur)，无初始值时首元素为 acc' },
      { args: [[1, 2, 3], function (prev, cur) { return prev + cur }, 10], note: '第三参为初始值' },
      { args: [{ a: 1, b: 2, c: 3 }, function (prev, cur) { return prev + cur }, 0], note: '对象按键序归并（无原生 reduce 的回退分支）' },
      { args: [[], function (prev, cur) { return prev + cur }, 10], note: '空数组+初始值返回 undefined（回退分支覆盖 previous 的怪癖）' },
      { args: [null, function (prev, cur) { return prev }], note: 'null 返回 undefined' },
    ],
    zip: [
      { args: [['a', 'b'], [1, 2], [true, false]], note: '多数组按位合并' },
      { args: [[1, 2], [3]], note: '不等长以最长为准补 undefined' },
      { args: [[1, 2]], note: '单数组每项成组' },
      { args: [], note: '无参返回 []' },
    ],
    unzip: [
      { args: [[['a', 1, true], ['b', 2, false]]], note: '典型解包' },
      { args: [[[1, 2], [3]]], note: '不等长以最长为准补 undefined' },
      { args: [[]], note: '空数组返回 []' },
    ],
    zipObject: [
      { args: [['a', 'b', 'c'], [1, 2, 3]], note: '键值数组转对象' },
      { args: [['a', 'b', 'c'], [1]], note: '值不足补 undefined' },
      { args: [['a', 'b']], note: '缺值数组全 undefined' },
      { args: [[], []], note: '空输入返回 {}' },
    ],
    uniq: [
      { args: [[1, 2, 1, 3, 2, 1]], note: '基础去重' },
      { args: [[1, '1', 1]], note: '严格相等比较，数字 1 与字符串 1 不互相去重' },
      { args: [[NaN, NaN, 1]], note: '底层 includes 用 SameValueZero，NaN 可去重' },
      { args: [[]], note: '空数组返回 []' },
    ],
    union: [
      { args: [[1, 2], [2, 3], [3, 4]], note: '多数组并集去重' },
      { args: [[1, 2]], note: '单数组等于 uniq' },
      { args: [[], []], note: '空数组们返回 []' },
      { args: ['ab', ['b', 'c']], note: '字符串参数被 toArray 拆成字符（怪癖）' },
    ],
    flatten: [
      { args: [[[1, 2], [3, 4]]], note: '默认浅层铺平' },
      { args: [[[1, [2, [3]]]], true], note: 'deep=true 深层铺平' },
      { args: [[1, 2]], note: '无嵌套原样返回' },
      { args: [null], note: '非数组返回 []' },
    ],
    chunk: [
      { args: [[1, 2, 3, 4, 5], 2], note: '不能整除时余项成最后一组' },
      { args: [[1, 2, 3], 0], note: 'size 0 经 >>0||1 按 1 处理' },
      { args: [[1, 2], 5], note: 'size 大于长度整体一组' },
      { args: [[1, 2, 3], -1], note: '负数 size 整体一组' },
      { args: [[], 2], note: '空数组返回 []' },
      { args: ['abc', 2], note: '非数组返回 []' },
    ],
    pluck: [
      { args: [[{ a: 1 }, { a: 2 }], 'a'], note: '抽取属性值数组' },
      { args: [[{ a: 1 }, {}], 'a'], note: '缺失属性为 undefined' },
      { args: [[], 'a'], note: '空数组返回 []' },
      { args: [null, 'a'], note: 'null 返回 []' },
    ],
    groupBy: [
      { args: [['one', 'two', 'three'], 'length'], note: '属性名分组' },
      { args: [[{ t: 'a' }, { t: 'b' }, { t: 'a' }], 't'], note: '对象数组按属性分组' },
      { args: [[6.1, 4.2, 6.3], function (v) { return Math.floor(v) }], note: '函数返回值分组' },
      { args: [[1, 2, 1]], note: '无 iterate 时 property(undefined) 使全部归入 "undefined" 键（怪癖）' },
      { args: [null, function (v) { return v }], note: 'null 返回 {}' },
    ],
    countBy: [
      { args: [[6.1, 4.2, 6.3], function (v) { return Math.floor(v) }], note: '按函数结果计数' },
      { args: [['a', 'bb', 'ccc'], 'length'], note: '按长度计数' },
      { args: [[{ t: 'a' }, { t: 'a' }, { t: 'b' }], 't'], note: '对象数组按属性计数' },
      { args: [[]], note: '空输入返回 {}' },
    ],
    toArrayTree: [
      {
        args: [[{ id: 1, parentId: null }, { id: 2, parentId: 1 }, { id: 3, parentId: 1 }, { id: 4, parentId: 2 }]],
        note: '默认 key:id / parentKey:parentId / children:children，节点带空 children 数组',
      },
      {
        args: [[{ id: 1, parentId: null }, { id: 2, parentId: 1 }], { strict: true }],
        note: 'strict 模式删除空 children 键（原地变异，生成器已克隆）',
      },
      {
        args: [[{ code: 'a', p: null }, { code: 'b', p: 'a' }], { key: 'code', parentKey: 'p', children: 'nodes' }],
        note: '自定义键名配置',
      },
      {
        args: [[{ id: 1, parentId: null }, { id: 2, parentId: 99 }]],
        note: 'parentId 不在 id 列表的孤儿节点也作为根返回',
      },
      { args: [[]], note: '空数组返回 []' },
    ],
    toTreeArray: [
      {
        args: [[{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }, { id: 4 }]],
        note: '默认 children 键，深度优先展平',
      },
      {
        args: [[{ id: 1, children: [{ id: 2 }] }], { clear: true }],
        note: 'clear 删除展开后节点上的 children 键（原地变异，生成器已克隆）',
      },
      {
        args: [[{ id: 1, data: { v: 1 } }], { data: 'data' }],
        note: 'data 配置解包节点数据',
      },
      { args: [[]], note: '空数组返回 []' },
    ],
    findTree: [
      {
        args: [[{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }, { id: 4 }], function (item) { return item.id === 3 }],
        note: '返回 { index, item, path, items, parent, nodes }，path 含 children 段',
      },
      {
        args: [[{ id: 1, children: [{ id: 2 }] }], function (item) { return item.id === 9 }],
        note: '未命中返回 undefined',
      },
      {
        args: [[{ id: 1, nodes: [{ id: 2 }] }], function (item) { return item.id === 2 }, { children: 'nodes' }],
        note: 'options.children 自定义子级键',
      },
    ],
    eachTree: [
      {
        args: [[{ id: 1, children: [{ id: 2 }] }], function (item, index, items, path, parent, nodes) { return path.join('/') }],
        note: '典型遍历，返回 undefined（iterate 副作用不可快照，锁定不抛错与签名）',
      },
      {
        args: [[{ id: 1, nodes: [{ id: 2 }] }], function (item) { return item.id }, { children: 'nodes' }],
        note: '自定义 children 键',
      },
      { args: [null, function (item) { return true }], note: 'null 入参不抛错，返回 undefined' },
    ],
    mapTree: [
      {
        args: [[{ id: 1, children: [{ id: 2 }] }], function (item) { return { id: item.id * 10 } }],
        note: '保留层级结构，children 由映射结果组成',
      },
      {
        args: [[{ id: 1, nodes: [{ id: 2 }] }], function (item) { return { v: item.id } }, { children: 'nodes', mapChildren: 'kids' }],
        note: '自定义 children/mapChildren 键',
      },
      { args: [[], function (item) { return item }], note: '空数组返回 []' },
    ],
    filterTree: [
      {
        args: [[{ id: 1, children: [{ id: 2 }, { id: 3 }] }, { id: 4 }], function (item) { return item.id !== 2 }],
        note: '返回扁平命中数组（DFS 序，不保留树结构）',
      },
      {
        args: [[{ id: 1, nodes: [{ id: 2 }] }], function (item) { return item.id === 2 }, { children: 'nodes' }],
        note: '自定义 children 键',
      },
      { args: [[{ id: 1 }], function (item) { return false }], note: '全不命中返回 []' },
    ],
    searchTree: [
      {
        args: [[{ id: 1, name: 'r', children: [{ id: 2, name: 'axe', children: [{ id: 4, name: 'zz' }] }, { id: 3, name: 'b' }] }], function (item) { return item.name.indexOf('a') > -1 }],
        note: '保留命中节点及其祖先/后代路径，未命中分支被剪掉，节点为浅拷贝且补 children: []',
      },
      {
        args: [[{ id: 1, children: [{ id: 2 }] }], function (item) { return false }],
        note: '全不命中返回 []',
      },
      {
        args: [[{ id: 1, nodes: [{ id: 2 }] }], function (item) { return item.id === 2 }, { children: 'nodes' }],
        note: '自定义 children 键',
      },
    ],
    arrayDistinct: [
      { args: [[1, 2, 1, 3, 1]], note: '基础去重（Map 键）' },
      { args: [[{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }], 'id'], note: '对象数组按属性去重，保留首个' },
      { args: [[1, '1', 1]], note: 'Map 键严格区分数字 1 与字符串 1' },
      { args: [null], note: 'null 直接读 reduce 抛错（无空值保护）' },
    ],
    sortBy: [
      { args: [[3, 1, 2]], note: '与 orderBy 同一实现，无配置按值升序' },
      { args: [[{ age: 25 }, { age: 10 }], 'age'], note: '属性升序' },
      { args: [[{ age: 25 }, { age: 10 }], [['age', 'desc']]], note: '数组配置 desc' },
      { args: [null], note: 'null 返回 []' },
    ],
  },
}
