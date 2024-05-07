export default function getCurrentSystemInfo() {
  const system = {
    win: undefined,
    mac: undefined,
    xll: undefined,
    iphone: undefined,
    ipod: undefined,
    ipad: undefined,
    ios: undefined,
    android: undefined,
    nokiaN: undefined,
    winMobile: undefined,
    wii: undefined,
    ps: undefined,
  };
  const ua = navigator.userAgent;
  // 检测平台
  const p = navigator.platform;
  system.win = p.indexOf('Win') === 0;
  system.mac = p.indexOf('Mac') === 0;
  system.xll = (p.indexOf('Xll') === 0 || p.indexOf('Linux') ===
        0);
  // 检测Windows操作系统
  if (system.win) {
    if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
      if (RegExp.$1 === 'NT') {
        switch (RegExp.$2) {
          case '5.0':
            system.win = '2000';
            break;
          case '5.1':
            system.win = 'XP';
            break;
          case '6.0':
            system.win = 'Vista';
            break;
          case '6.1':
            system.win = '7';
            break;
          case '6.2':
            system.win = '8';
            break;
          case '6.3':
          case '10.0':
            system.win = '10';
            break;
          default:
            system.win = 'NT';
            break;
        }
      }
      else if (RegExp.$1 === '9x') {
        system.win = 'ME';
      }
      else {
        system.win = RegExp.$1;
      }
    }
  }
  // 移动设备
  system.iphone = ua.indexOf('iPhone') > -1;
  system.ipod = ua.indexOf('iPod') > -1;
  system.ipad = ua.indexOf('iPad') > -1;
  system.nokiaN = ua.indexOf('nokiaN') > -1;
  // windows mobile
  if (system.win === 'CE') {
    system.winMobile = system.win;
  }
  else if (system.win === 'Ph') {
    if (/Windows Phone OS (\d+.\d)/i.test(ua)) {
      system.win = 'Phone';
      system.winMobile = parseFloat(RegExp.$1);
    }
  }
  // 检测IOS版本
  if (system.mac && ua.indexOf('Mobile') > -1) {
    if (/CPU (?:iPhone )?OS (\d+_\d+)/i.test(ua)) {
      system.ios = parseFloat(RegExp.$1.replace('_', '.'));
    }
    else {
      system.ios = 2; // 不能真正检测出来，所以只能猜测
    }
  }
  // 检测Android版本
  if (/Android (\d+\.\d+)/i.test(ua)) {
    system.android = parseFloat(RegExp.$1);
  }
  // 游戏系统
  system.wii = ua.indexOf('Wii') > -1;
  system.ps = /PlayStation/i.test(ua);
  const systemObj = Object.entries(system).find(i => i[1])
  return {
    System: (systemObj && systemObj[0])  || 'UNKNOWN',
    ScreenSize: (function () {
      return screen.width + ',' + screen.height;
    })(),
  };
}
export { getCurrentSystemInfo, };
