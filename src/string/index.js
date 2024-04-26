/*
 * @Author: QINJIN
 * @Date: 2024-04-15 16:29:51
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-19 17:28:19
 * @FilePath: /spark-utils/src/string/index.js
 * @Description: 字符串方法聚合 
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */


import toValueString from './toValueString'
import trim from './trim'
import trimLeft from './trimLeft'
import trimRight from './trimRight'
import escape from './escape'
import unescape from './unescape'
import camelCase from './camelCase'
import kebabCase from './kebabCase'
import repeat from './repeat'
import padStart from './padStart'
import padEnd from './padEnd'
import startsWith from './startsWith'
import endsWith from './endsWith'
import template from './template'
import sortWithCharacter from './sortWithCharacter'
import pinyin from './pinyin'
import format from './format'
import formatWithReq from './formatWithReq'
import formatWithIndex from './formatWithIndex'
import checkPass from './checkPass'
import uuid from './uuid'


export default {
	toString: toValueString,
	trim,
	trimLeft,
	trimRight,
	escape,
	unescape,
	camelCase,
	kebabCase,
	repeat,
	padStart,
	padEnd,
	startsWith,
	endsWith,
	template,
	sortWithCharacter,
	pinyin,
	format,
	formatWithReq,
	formatWithIndex,
	checkPass,
	uuid,
}
