/*
 * @Author: QINJIN
 * @Date: 2024-04-19 17:37:59
 * @LastEditors: QINJIN
 * @LastEditTime: 2024-04-20 11:45:50
 * @FilePath: /spark-utils/src/browse/index.js
 * @Description: 浏览器方法聚合
 * Copyright (c) 2024 by QINJIN, All Rights Reserved. 
 */

require('./crossDomain')
import browse from './browse'
import locat from './locat'
import parseUrl from './parseUrl'
import serialize from './serialize'
import unserialize from './unserialize'
import getNowPageParam from './getNowPageParam'
import objectToUrlParam from './objectToUrlParam'
import getBaseURL from './getBaseURL'
import cookie from './cookie'
import isIE from './isIE'
import notSupported from './notSupported'
import isIE9 from './isIE9'
import isIE10 from './isIE10'
import isIE11 from './isIE11'
import isChrome from './isChrome'
import isFireFox from './isFireFox'
import isSafari from './isSafari'
import clientSystem from './clientSystem'
import clientScreenSize from './clientScreenSize'
import clientBrowser from './clientBrowser'
import { copyText } from './clipboard';


export default {
    browse,
    locat,
    parseUrl,
    serialize,
    unserialize,
    getNowPageParam,
    objectToUrlParam,
    getBaseURL,
    cookie,
    isIE,
    notSupported,
    isIE9,
    isIE10,
    isIE11,
    isChrome,
    isFireFox,
    isSafari,
    clientSystem,
    clientScreenSize,
    clientBrowser,
    copyText
}