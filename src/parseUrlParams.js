/**
 * @description: 解析url地址参数
 * @param {String} url 地址
 * @return {*}
 */
function parseUrlParams (url) {
  if (!url) return {};
    const params = {};
    if (url.includes('?')) {
      const queryString = url.split('?')[1]
      const paramPairs = queryString.split('&')
  
      paramPairs.forEach(pair => {
        const [key, value] = pair.split('=')
        params[key] = decodeURIComponent(value)
      });
    }
  
    return params;
  }

  export default parseUrlParams