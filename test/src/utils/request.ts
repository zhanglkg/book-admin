import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { message } from 'antd';
import { clearToken, getToken } from './auth';
import type { ApiResponse } from '@/types/api';

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
});

// 请求拦截器：注入 Token
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：统一解包与错误处理
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    if (res.code !== 0) {
      if (res.code === 401) {
        clearToken();
        message.error(res.message || '登录已过期，请重新登录');
        if (window.location.pathname !== '/login') window.location.href = '/login';
      } else {
        message.error(res.message || '请求失败');
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status;
    if (status === 401) {
      clearToken();
      message.error('登录已过期，请重新登录');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else {
      message.error(error.response?.data?.message || error.message || '网络异常，请稍后重试');
    }
    return Promise.reject(error);
  },
);

export default request;
