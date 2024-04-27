import axios from 'axios';
import setupDefaults from '../constant/setup/setupDefaults'
import SparkUtils  from '../index'

function init(options = {}) {
  const config = options.config || setupDefaults.axiosConfig 
  const {request, requestFailed, response, responseFailed,} = options.interceptors || {}
  // 提交配置方法
  const submitConfig = { 
    get: (instance, url, data, config) => instance.get(url, {...config, params: data, }),
    post: (instance, url, data, config) => instance.post(url, data, config), 
    put: (instance, url, data, config) => instance.put(url, data, config), 
    delete: (instance, url, config) => instance.delete(url, config),
  }
  // 创建一个 axios 实例
  const instance = axios.create(config);
  // 请求拦截器，可以在请求发送之前进行一些处理，比如添加 token
  instance.interceptors.request.use(
    config => {
      return request ? request(config) : config;
    },
    error => {
      requestFailed && requestFailed(error)
      return Promise.reject(error);
    }
  )
  // 响应拦截器，可以统一处理错误响应等
  instance.interceptors.response.use(
    responseRes => {
      return response ? response(responseRes) : responseRes.data;
    },
    error => {
      responseFailed && responseFailed(error)
      return Promise.reject(error);
    }
  )
  // 挂载请求方法
  SparkUtils.https.submit = (options = {}) => {
    let { url, method = 'POST', data, autoQs, config = {},} = options
    if(!url) return Promise.reject(new Error(`[spark-utils][https.submit]: 请传入url参数!`))
    autoQs === false && (config.headers = {'Content-Type':'application/json; charset=UTF-8',})
    return submitConfig[method.toLowerCase()](instance, url, data, config)
  }
}
export default init