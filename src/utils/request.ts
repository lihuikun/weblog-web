import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { decryptData } from './decrypt';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/userStore';

const encryptionKey = import.meta.env.VITE_CRYPTO_KEY || '';
console.log("🚀 ~ import.meta.env:", import.meta.env)
// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
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
        const userStore = useUserStore();
        userStore.setToken('');
        userStore.setUserInfo(null);
        window.location.href = '/login';
      }

      return Promise.reject(new Error(res.message || 'Error'));
    }
    encryptionKey && (res.data = decryptData(res.data))
    console.log("🚀 ~ res.data:", res.data)
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
          const userStore = useUserStore();
          userStore.setToken('');
          userStore.setUserInfo(null);
          window.location.href = '/login';
          break;
        case 403:
          // 禁止访问
          message.error('禁止访问');
          // 清掉pinia的token
          useUserStore().setToken('');
          useUserStore().setUserInfo(null);
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
export function get<T>(url: string, params?: any, config?: InternalAxiosRequestConfig): Promise<T> {
  return service.get(url, { params, ...config });
}

// 封装 POST 请求
export function post<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
  return service.post(url, data, config);
}

// 封装 PUT 请求
export function put<T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
  return service.put(url, data, config);
}

// 封装 DELETE 请求
export function del<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
  return service.delete(url, config);
}

export default service;