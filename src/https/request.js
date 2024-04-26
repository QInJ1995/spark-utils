import axios from "axios";
import setupDefaults from "../constant/setup/setupDefaults";

// 创建一个 axios 实例
const instance = axios.create(setupDefaults.axiosConfig);

// 请求拦截器，可以在请求发送之前进行一些处理，比如添加 token
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器，可以统一处理错误响应等
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response.data;
  },
  (error) => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

// 封装 GET 请求
export const get = (url, params = {}) => {
  return instance.get(url, { params, });
};

// 封装 POST 请求
export const post = (url, data = {}) => {
  return instance.post(url, data);
};

// 其他方法类似，可以根据需要封装不同的请求方法

export default instance;
