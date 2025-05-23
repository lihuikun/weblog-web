// 旧的请求方式,没有加解密
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/userStore'

console.log("🚀 ~ import.meta.env:", import.meta.env)
// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: '/upload',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理，例如添加 token
    const token = useUserStore().token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 如果配置了 FormData 类型，则需要设置 Content-Type 为 multipart/form-data
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    // 根据自定义错误码处理错误
    if (res.code && res.code !== 200) {
      console.error('Response error:', res.message || 'Error');
      message.error(res.message || 'Error');
      // 401: 未登录或 token 过期
      if (res.code === 401) {
        // 可以在这里处理登出逻辑
        // store.dispatch('user/logout');
        // router.push('/login');
      }

      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error) => {
    console.error('Response error:', error);
    message.error(error.response.data.msg || 'Error');
    // 处理 HTTP 状态码错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          // router.push('/login');
          break;
        case 403:
          // 禁止访问
          break;
        case 404:
          // 资源不存在
          break;
        case 500:
          // 服务器错误
          break;
      }
    }

    return Promise.reject(error);
  }
);

// 封装 GET 请求
export function get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.get(url, { params, ...config });
}

// 封装 POST 请求
export function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const defaultConfig: AxiosRequestConfig = {};

  // 如果传入的数据是 FormData 类型，则需要设置 Content-Type 为 multipart/form-data
  if (data instanceof FormData) {
    defaultConfig.headers = {
      'Content-Type': 'multipart/form-data'
    };
  }

  return service.post(url, data, { ...defaultConfig, ...config });
}

// 封装 PUT 请求
export function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.put(url, data, config);
}

// 封装 DELETE 请求
export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return service.delete(url, config);
}

export default service;