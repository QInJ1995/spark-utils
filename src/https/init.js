import axios from 'axios';
import setupDefaults from '../constant/setup/setupDefaults'
import SparkUtils  from '../index'

function init(options = {}) {
  const config = options.config || setupDefaults.axiosConfig 
  const {request, requestFailed, response, responseFailed,} = options.interceptors || {}
  // 创建一个 axios 实例
  const instance = axios.create(config);

  // 请求拦截器，可以在请求发送之前进行一些处理，比如添加 token
  instance.interceptors.request.use(
    config => {
      // 在发送请求之前做些什么
      return request ? request(config) : config;
    },
    error => {
      // 对请求错误做些什么
	 requestFailed && requestFailed(error)
      return Promise.reject(error);
    }
  )

  // 响应拦截器，可以统一处理错误响应等
  instance.interceptors.response.use(
    responseRes => {
      // 对响应数据做些什么
      return response ? response(responseRes) : responseRes;
    },
    error => {
      // 对响应错误做些什么
	  responseFailed && responseFailed(error)
      return Promise.reject(error);
    }
  )
  // 挂载请求方法
  SparkUtils.https.submit = (options = {}) => {
    let { url, method, data, autoQs, config = {},} = options
    if(!url || !method) return Promise.reject(new Error(`[spark-utils][https.submit]: 请传入url或者method参数!`))
    autoQs === false && (config.headers = {'Content-Type':'application/json; charset=UTF-8',})
    const submitConfig = { get: get, post: post, }
    return submitConfig[method](instance, url, data, config)
  }
}

// 封装 GET 请求
function get(instance, url, data, config ) {
  return instance.get(url, {...config, params: data, });
}
// 封装 POST 请求
function post(instance, url, data, config) {
  return instance.post(url, data, config);
}

export default init