/**
 * date 模块行为快照用例（锁定 v1 旧行为，供 2.0 TS 重写比对）
 * 覆盖 17 个方法：isTime isDateTime dateToString StringToDate dateDiff getDateDiff
 * toStringDate toDateString getWhatYear getWhatMonth getWhatWeek getWhatDay
 * getDayOfYear getYearDay getYearWeek getMonthWeek getDayOfMonth
 * 排除：moment 桥接 9 个（删除）、now/timestamp/getCur* 当前时间类（不确定）
 * 规则：所有日期输入写死为 new Date('固定ISO') 或固定字符串
 */
export default {
  module: 'date',
  methods: {
    isTime: [
      { args: ['08:30:00'] },
      { args: ['23:59:59'] },
      { args: ['24:00:00'], note: '小时 24 非法' },
      { args: ['8:30:00'], note: '长度 7（非 8）直接 false' },
      { args: [undefined], note: 'undefined 无 length，抛 TypeError' },
    ],
    isDateTime: [
      { args: ['2024-03-05 08:30:00'], note: '合法：日期 + 空格 + 时间，总长 19' },
      { args: ['2024-13-05 08:30:00'], note: '月份 13 溢出 false' },
      { args: ['2024-02-30 08:30:00'], note: '2 月 30 日溢出 false' },
      { args: ['2024-03-05T08:30:00'], note: 'T 分隔不符合内部约定（无空格）false' },
      { args: [12345], note: '数字无 length（undefined !== 19），返回 false 不抛错' },
    ],
    dateToString: [
      { args: [new Date('2024-03-05T08:30:00'), 'YYYY-MM-DD'], note: 'moment format：YYYY-MM-DD' },
      { args: [new Date('2024-03-05T08:30:00'), 'YYYY-MM-DD HH:mm:ss'] },
      { args: [new Date('2024-03-05T08:30:00'), 'YYYY年MM月DD日'], note: '中文格式' },
      { args: [new Date('2024-03-05T08:30:00')], note: '不传 format：moment().format(undefined) 输出本地时区 ISO' },
      { args: ['not-a-date', 'YYYY-MM-DD'], note: '非法输入返回 "Invalid date"' },
    ],
    StringToDate: [
      { args: ['2024-03-05'] },
      { args: ['2024-03-05 08:30:00'], note: '日期时间串（内部 - 替换为 / 后 new Date）' },
      { args: ['2024/03/05'], note: '斜杠分隔同样支持' },
      { args: ['2024-13-01'], note: '月份非法（isDateString 校验 Date 回读）返回 false' },
      { args: ['abc'], note: '非日期串返回 false（不抛错）' },
    ],
    dateDiff: [
      { args: ['2024-01-01', '2024-03-10', 'd'], note: '字符串入参自动 StringToDate：69 天' },
      { args: ['2024-01-01', '2024-03-10 12:00:00', 'h'], note: '混合日期时间串按小时' },
      { args: ['2024-01-15', '2024-03-15', 'M'], note: '月差（按 getMonth 差计算）' },
      { args: [new Date('2024-03-05T08:00:00'), new Date('2024-03-05T08:01:30'), 'n'], note: 'Date 入参按分钟（parseInt 截断）' },
      { args: ['2024-03-10', '2024-01-01', 'd'], note: '结束早于开始：负数 -69' },
      { args: ['abc', '2024-01-01', 'd'], note: '非法入参返回 false' },
    ],
    getDateDiff: [
      { args: [new Date('2024-03-05T08:30:00'), new Date('2024-03-08T10:00:00')], note: '默认规则：3 天 1 小时 30 分的差值明细对象' },
      { args: [new Date('2024-01-01T00:00:00'), new Date('2025-03-01T12:30:45')], note: '跨年差值明细' },
      { args: [new Date('2024-03-08T10:00:00'), new Date('2024-03-05T08:30:00')], note: '结束早于开始：done 为 false' },
      { args: ['abc', new Date('2024-03-05')], note: '非法开始日期：done 为 false' },
      { args: [new Date('2024-03-05T08:30:00'), new Date('2024-03-05T08:30:01'), [['ss', 1000]]], note: '自定义 rules 数组' },
    ],
    toStringDate: [
      { args: ['2024-03-05'], note: '默认格式解析为本地 0 点' },
      { args: ['2024-03-05 08:30:00'] },
      { args: ['05/03/2024', 'dd/MM/yyyy'], note: '自定义 format 解析英式日期' },
      { args: [1709619000000], note: '11-15 位数字串按毫秒时间戳解析' },
      { args: ['2024-13-01'], note: '怪癖：月份 13 不校验，构造函数进位到 2025-01-01' },
      { args: ['abc'], note: '解析失败返回 Invalid Date' },
    ],
    toDateString: [
      { args: [new Date('2024-03-05T08:30:00')], note: '默认格式 yyyy-MM-dd HH:mm:ss' },
      { args: [new Date('2024-03-05T08:30:00'), 'MM/dd/yyyy'] },
      { args: [new Date('2024-03-05T20:30:00'), 'yyyy-MM-dd hh:mm A'], note: '12 小时制 + 上午/下午（08:30 PM）' },
      { args: [new Date('2024-03-05T08:30:00'), 'yyyy-w-Q-E'], note: '年内周数 w / 季度 Q / 星期 E' },
      { args: ['not a date'], note: '非法输入返回 "Invalid Date"' },
      { args: [undefined], note: '空入参返回空串' },
    ],
    getWhatYear: [
      { args: [new Date('2024-03-05T08:30:00'), 1], note: '后 1 年，保留时分秒' },
      { args: [new Date('2024-03-05T08:30:00'), -1], note: '前 1 年' },
      { args: [new Date('2024-03-05T08:30:00'), 0, 'first'], note: '年初：2024-01-01 00:00:00' },
      { args: [new Date('2024-03-05T08:30:00'), 1, 'last'], note: '下一年年末：2025-12-31 23:59:59.999' },
      { args: ['abc'], note: '非法输入返回 Invalid Date' },
    ],
    getWhatMonth: [
      { args: [new Date('2024-03-05T08:30:00'), 1], note: '后 1 月' },
      { args: [new Date('2024-01-31T10:00:00'), 1], note: '怪癖：1 月 31 日 +1 月溢出到 2 月 29（2024 闰年，回退为月末）' },
      { args: [new Date('2024-03-05T08:30:00'), 0, 'first'], note: '月初：2024-03-01 00:00:00' },
      { args: [new Date('2024-03-05T08:30:00'), 0, 'last'], note: '月末：2024-03-31 23:59:59.999' },
      { args: [new Date('2024-03-05T08:30:00'), -2], note: '前 2 月' },
    ],
    getWhatWeek: [
      { args: [new Date('2024-03-05T08:30:00'), 0, 1], note: '本周周一：2024-03-04（2024-03-05 是周二）' },
      { args: [new Date('2024-03-05T08:30:00'), -1, 1], note: '上周周一：2024-02-26' },
      { args: [new Date('2024-03-05T08:30:00')], note: '不传参数：当天本身（周二）' },
      { args: [new Date('2024-03-05T08:30:00'), 0, 0], note: '怪癖：day=0（周日）按 7 处理，取到的是下一个周日 2024-03-10' },
      { args: [new Date('2024-03-09T08:30:00'), 0, 3], note: '指定周三：2024-03-06' },
    ],
    getWhatDay: [
      { args: [new Date('2024-03-05T08:30:00'), 10], note: '后 10 天' },
      { args: [new Date('2024-03-05T08:30:00'), -5], note: '前 5 天：跨闰月到 2024-02-29' },
      { args: [new Date('2024-03-05T08:30:00'), 0, 'first'], note: '日初：2024-03-05 00:00:00' },
      { args: [new Date('2024-03-05T08:30:00'), 0, 'last'], note: '日末：2024-03-05 23:59:59.999' },
      { args: [new Date('2024-03-05T08:30:00')], note: '不传 offset：原样返回（保留时分秒）' },
    ],
    getDayOfYear: [
      { args: [new Date('2024-06-15')], note: '2024 闰年 366 天' },
      { args: [new Date('2023-06-15')], note: '2023 平年 365 天' },
      { args: [new Date('2023-06-15'), 1], note: 'offset 跨入闰年 2024 → 366' },
      { args: ['abc'], note: '非法输入返回 NaN' },
    ],
    getYearDay: [
      { args: [new Date('2024-03-05T08:30:00')], note: '年内第 65 天（31+29+5，闰年）' },
      { args: [new Date('2024-01-01')], note: '第 1 天' },
      { args: [new Date('2023-12-31')], note: '平年最后一天 365' },
      { args: [new Date('2024-12-31')], note: '闰年最后一天 366' },
      { args: ['abc'], note: '非法输入返回 NaN' },
    ],
    getYearWeek: [
      { args: [new Date('2024-03-05')], note: 'ISO 周算法：第 10 周' },
      { args: [new Date('2024-01-01')], note: '第 1 周' },
      { args: [new Date('2023-12-31')], note: '年末周：2023 第 52 周' },
      { args: ['abc'], note: '非法输入返回 NaN' },
    ],
    getMonthWeek: [
      { args: [new Date('2024-03-05')], note: '月内第 1 周（周一为周首，3 月 4 日起算）' },
      { args: [new Date('2024-03-31')], note: '月内第 4 周' },
      { args: [new Date('2024-03-01')], note: '怪癖：3 月 1 日（周五）落回按 2 月计，返回 2 月的第 4 周' },
      { args: ['abc'], note: '非法输入返回 NaN' },
    ],
    getDayOfMonth: [
      { args: [new Date('2024-02-01')], note: '闰年 2 月 29 天' },
      { args: [new Date('2023-02-01')], note: '平年 2 月 28 天' },
      { args: [new Date('2024-07-15')], note: '7 月 31 天' },
      { args: [new Date('2024-03-15'), -1], note: 'offset 前 1 月：2024 年 2 月 29 天' },
      { args: ['abc'], note: '非法输入返回 NaN' },
    ],
  },
}
