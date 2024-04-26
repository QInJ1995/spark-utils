import staticParseInt from '../constant/static/staticParseInt'
import helperGetHGSKeys from '../helpers/helperGetHGSKeys'
import hasOwnProp from '../basic/hasOwnProp'

var sKeyRE = /(.+)\[(\d+)\]$/

function setDeepProps (obj, key, isSet, value) {
	if (obj[key]) {
		if (isSet) {
			obj[key] = value
		}
	} else {
		var index
		var matchs = key ? key.match(sKeyRE) : null
		var rest = isSet ? value : {}
		if (matchs) {
			index = staticParseInt(matchs[2])
			if (obj[matchs[1]]) {
				obj[matchs[1]][index] = rest
			} else {
				obj[matchs[1]] = new Array(index + 1)
				obj[matchs[1]][index] = rest
			}
		} else {
			obj[key] = rest
		}
		return rest
	}
	return obj[key]
}

/**
 * 设置对象属性上的值。如果属性不存在则创建它
 * @param {Object/Array} obj 对象
 * @param {String/Function} property 键、路径
 * @param {Object} value 值
 */
function set (obj, property, value) {
	if (obj) {
		if ((obj[property] || hasOwnProp(obj, property)) && !isPrototypePolluted(property)) {
			obj[property] = value
		} else {
			var rest = obj
			var props = helperGetHGSKeys(property)
			var len = props.length
			for (var index = 0; index < len; index++) {
				if (isPrototypePolluted(props[index])) continue
				rest = setDeepProps(rest, props[index], index === len - 1, value)
			}
		}
	}
	return obj
}

/**
 * Blacklist certain keys to prevent Prototype Pollution
 * @param {string} key
 */
function isPrototypePolluted(key) {
	return key === '__proto__' || key === 'constructor' || key === 'prototype'
}

export default set
