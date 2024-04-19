import {formatWithIndex} from './formatWithIndex'

export const ruleLib = {
  name: {
    indexRule: [{start: 2, stop: null,}],
    reqRule: {srcReq: /^(\w{1})\w*$/, descReq: '$1*',},
    desensitization: function (value) {
      return formatWithIndex(value, this.indexRule)
    },
  },
  idcard: {
    indexRule: [{start: 4, stop: 14,}],
    reqRule: {srcReq: /^([\d]{3})\d{1,11}(\w*)$/, descReq: '$1********$2',},
    desensitization: function (value) {
      return formatWithIndex(value, this.indexRule)
    },
  },
  date: {
    indexRule: [{start: 6, stop: 7,}, {start: 9, stop: 10,}],
    reqRule: {srcReq: /^([\d]{4}-)(\w*)$/, descReq: '$1********',},
    desensitization: function (value) {
      return formatWithIndex(value, this.indexRule)
    },
  },
  email: {
    reqRule: {srcReq: /^(\w+([-+.]\w+)*)@(\w+([-.]\w+)*\.\w+([-.]\w+)*)$/, descReq: '****@$3',},
    desensitization: function (value) {
      return formatWithReq(value, this.reqRule)
    },
  },
  zipcode: {
    indexRule: [{start: 2, stop: null,}],
    reqRule: {srcReq: /^([1-9])[0-9]{1,5}$/, descReq: '$1*****',},
    desensitization: function (value) {
      return formatWithIndex(value, this.indexRule)
    },
  },
  telphone: {
    indexRule: [{start: 6, stop: null,}],
    reqRule: {srcReq: /^([0-9]{3,4})-\d*$/, descReq: '$1-********',},
    desensitization: function (value) {
      return formatWithIndex(value, this.indexRule)
    },
  },
  mobile: {
    indexRule: [{start: 4, stop: 7,}],
    reqRule: {srcReq: /^(1[3|4|5|7|8][0-9])\d{1,4}(\d*)$/, descReq: '$1****$2',},
    desensitization: function (value) {
      return formatWithIndex(value, this.indexRule)
    },
  },
  ip: {},
}
