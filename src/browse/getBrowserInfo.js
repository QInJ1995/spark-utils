export default function getBrowserInfo() {
    const agent = navigator.userAgent.toLowerCase();
    let Browser = 'UNKNOWN';
    let Bversion;
    // IE
    if (agent.indexOf('msie') >= 0) {
        const regStrIe = /msie [\d]+/gi;
        Browser = 'IE';
        Bversion = '' + agent.match(regStrIe);
    }
    // firefox
    else if (agent.indexOf('firefox') >= 0) {
        const regStrFf = /firefox\/[\d]+/gi;
        Browser = 'firefox';
        Bversion = '' + agent.match(regStrFf);
    }
    // Chrome
    else if (agent.indexOf('chrome') >= 0) {
        let regStrChrome;
        if (agent.indexOf('edge') >= 0) {
            regStrChrome = /edge\/[\d]+/gi;
            Browser = 'edge';
        }
        else {
            regStrChrome = /chrome\/[\d]+/gi;
            Browser = 'chrome';
        }
        // var regStrChrome = /chrome\/[\d.]+/gi;
        // Browser = "chrome";
        Bversion = '' + agent.match(regStrChrome);
    }
    // Safari
    else if (agent.indexOf('safari') >= 0 && agent.indexOf('chrome') < 0) {
        const regStrSaf = /version\/[\d]+/gi;
        Browser = 'safari';
        Bversion = '' + agent.match(regStrSaf);
    }
    // Opera
    else if (agent.indexOf('opera') >= 0) {
        const regStrOpera = /version\/[\d]+/gi;
        Browser = 'opera';
        Bversion = '' + agent.match(regStrOpera);
    }
    else {
        const browser = navigator.appName;
        if (browser === 'Netscape') {
            Bversion = agent.match(/rv:[\d]+/gi);
            Browser = 'IE';
        }
    }
    const versionNum = (Bversion + '').replace(/[^0-9.]/ig, '');
    return {
        Browser: Browser,
        versionNum: versionNum,
    };
}
export { getBrowserInfo, };
