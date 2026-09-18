/**
 * string 模块行为快照用例（锁定 v1 旧行为，供 2.0 TS 重写比对）
 * 覆盖 11 个方法：toString escape unescape camelCase kebabCase template
 * sortWithCharacter format formatWithReq formatWithIndex checkPass
 * 排除：trim/trimLeft/trimRight/repeat/padStart/padEnd/startsWith/endsWith（删除）、
 *       uuid（随机）、pinyin（移子入口）
 */
export default {
  module: 'string',
  methods: {
    toString: [
      { args: [123.456] },
      { args: [0] },
      { args: [1e21], note: '数字走 toNumberString：科学计数展开为全数字字符串' },
      { args: [null], note: 'null 返回空串' },
      { args: [undefined], note: 'undefined 返回空串' },
      { args: [true], note: '布尔转 "true"' },
    ],
    escape: [
      { args: ['<a href="#" class=\'x\'>&`</a>'], note: '六个保留字符全部转义' },
      { args: ['plain text'], note: '无特殊字符原样返回' },
      { args: ['&lt;'], note: '二次转义怪癖：& 被再转义为 &amp;lt;' },
      { args: [123], note: '非字符串先 toValueString 再替换' },
    ],
    unescape: [
      { args: ['&lt;a href=&quot;#&quot;&gt;&amp;&#x27;&#x60;&lt;/a&gt;'], note: '与 escape 互逆' },
      { args: ['&amp;lt;'], note: '单次解码怪癖：只解一层，结果为 &lt;' },
      { args: ['plain text'] },
      { args: [123], note: '非字符串先 toValueString' },
    ],
    camelCase: [
      { args: ['project-name'] },
      { args: ['project-name-list'] },
      { args: ['ProjectName'], note: '首字母大写转小写驼峰' },
      { args: ['PROJECTName'], note: '连续大写怪癖行为记录' },
      { args: [''], note: '空串原样返回' },
    ],
    kebabCase: [
      { args: ['projectName'] },
      { args: ['projectNameList'], note: '多个大写断点' },
      { args: ['FirstName'] },
      { args: ['XMLHttpRequest'], note: '连续大写怪癖行为记录' },
      { args: [123], note: '数字输入返回 "123"' },
    ],
    template: [
      { args: ['{{name}}-{{version}}', { name: 'spark', version: 2 }], note: '定界符为 {{key}}（默认 tmplRE）' },
      { args: ['{{user.profile.city}}', { user: { profile: { city: '深圳' } } }], note: '支持点路径嵌套取值' },
      { args: ['{{list.1.tag}}', { list: [{ tag: 'a' }, { tag: 'b' }] }], note: '支持数组下标路径' },
      { args: ['{{name}}', { name: 0 }], note: '值为 0 时输出 "0"（非 undefined）' },
      { args: ['{{missing}}', {}], note: '缺失 key 输出字符串 "undefined"' },
      { args: ['no placeholder', { a: 1 }], note: '无定界符原样返回' },
    ],
    sortWithCharacter: [
      { args: [['banana', 'apple', 'cherry']], note: '默认 zh locale + 升序' },
      { args: [[10, 2, 1, 20]], note: 'numeric: true 按数值排序为 [1,2,10,20]' },
      { args: [['b', 'A', 'C', 'a']], note: 'sensitivity: base 忽略大小写' },
      { args: [['张三', '李四', '王五'], { locale: 'zh', rule: 0 }], note: 'rule: 0(DescOrAsc.desc) 降序' },
      { args: [[], { locale: 'zh', rule: 1 }], note: '空数组返回空数组' },
    ],
    format: [
      { args: ['mobile', '13812345678'], note: '手机号：indexRule 打码 4-7 位 → 138****5678' },
      { args: ['mobile', 13812345678], note: '怪癖：数字输入经 toString 后同样打码' },
      { args: ['name', '张三'], note: '姓名：保留首字 → 张*' },
      { args: ['idcard', '11010519491231002X'], note: '身份证：打码 4-14 位' },
      { args: ['email', 'user@example.com'], note: '邮箱：reqRule 正则打码 → ****@example.com' },
      { args: ['ip', '192.168.1.1'], note: 'ip 规则为空对象，调用 undefined 抛 TypeError' },
    ],
    formatWithReq: [
      // 注意：以下用例含 RegExp 入参，gen-fixtures.mjs 的 deepClone 会把 RegExp 克隆成 {}，
      // 导致生成器记录的输出失真（replace 不命中）——需先修 deepClone 再生成，用例本身合法。
      { args: ['13812345678', { srcReq: /^(1[3|4|5|7|8][0-9])\d{1,4}(\d*)$/, descReq: '$1****$2' }], note: '正则捕获组替换：138****5678（RegExp 入参，见文件头注意）' },
      { args: ['user@example.com', { srcReq: /^(\w+([-+.]\w+)*)@(\w+([-.]\w+)*\.\w+([-.]\w+)*)$/, descReq: '****@$3' }], note: '邮箱打码（RegExp 入参，见文件头注意）' },
      { args: ['no-match-text', { srcReq: /^\d+$/, descReq: '***' }], note: '不匹配时原样返回（RegExp 入参，见文件头注意）' },
    ],
    formatWithIndex: [
      { args: ['13812345678', [{ start: 4, stop: 7 }]], note: 'start/stop 为 1 基索引闭区间：打码第 4-7 位' },
      { args: ['王小明', [{ start: 2, stop: null }]], note: 'stop 为 null 时打码到末尾' },
      { args: ['11010519491231002X', [{ start: 1, stop: 2 }, { start: 17, stop: 18 }]], note: '多规则叠加：首 2 位与末 2 位' },
      { args: ['abc', [{ start: 5, stop: 6 }]], note: '长度不足 start 时跳过该规则' },
      { args: [null, [{ start: 1, stop: 2 }]], note: 'null 返回空串' },
    ],
    checkPass: [
      { args: ['123456'], note: '6 位纯数字 → 等级 1' },
      { args: ['12345678'], note: '仅 1 类字符 → 归零返回 0' },
      { args: ['abcd1234'], note: '小写+数字 → 等级 2' },
      { args: ['Abcd1234'], note: '大写+小写+数字 → 等级 3' },
      { args: ['Abcd12#$'], note: '四类字符 → 等级 4（长度 8 也放行，注释写 10-18 但代码是 8-20）' },
      { args: ['中文abc123'], note: '怪癖：中文拦截正则写错（含空格的 | 交替）不生效，且中文计入 \\W，返回 3' },
    ],
  },
}
