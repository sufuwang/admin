import { useAuthStore } from '@/stores/auth-store';
import axios, { type AxiosRequestConfig } from 'axios';
import { toast } from "sonner"

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/',
  timeout: 10000,
  withCredentials: true, // 跨域携带 Cookie（SSO 必须）
});

// ==============================
// 请求拦截器
// ==============================
http.interceptors.request.use(
  (config) => {
    // 若后端通过 HttpOnly cookie 携带 token，这里无需操作
    // 若后端通过 header 传递 token，可按需注入：
    // const token = localStorage.getItem('access_token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    if (config.url?.startsWith('/dify')) {
      config.url = config.url.replace('/dify', 'https://api.dify.ai/v1')
      config.headers.Authorization = `Bearer ${import.meta.env.VITE_DIFY_KEY}`
      config.withCredentials = false

      if (config.method === 'get') {
        config.params = {
          ...(config.params || {}),
          user: import.meta.env.VITE_DIFY_USER,
          conversation_id: import.meta.env.VITE_DIFY_CONSERVATION_ID
        };
      }
    }

    // 防止 GET 缓存
    if (config.method === 'get') {
      config.params = { ...(config.params || {}), _t: Date.now() };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// 响应拦截器
// ==============================
let isRefreshing = false;
let requestQueue: Array<(token: string) => void> = [];

http.interceptors.response.use(
  (response) => {
    const { data } = response.data
    if (data?.access_token) {
      useAuthStore.getState().auth.setAccessToken(data.access_token)
    }
    if (data?.redirect_url) {
      window.location.href = data.redirect_url
    }
    return data
  },
  async (error) => {
    const { response, config } = error;

    // 网络异常
    if (!response) {
      toast.error('网络异常，请检查网络连接');
      setTimeout(() => {
        window.location.href = '/sign-in'
      }, 600)
      return Promise.reject(error);
    }

    const { status, data } = response;

    // access_token 过期
    if (status === 401 && !config._retry) {
      if (data.message) {
        toast.error(data.message)
      } else {
        toast.error('请重新登录！')
      }
      setTimeout(() => {
        window.location.href = '/sign-in'
      }, 600)
      return Promise.reject(error);

      config._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          requestQueue.push((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            resolve(http(config));
          });
        });
      }

      isRefreshing = true;
      try {
        // 向 SSO 请求新 token（Cookie 模式）
        const res = await axios.get('/sso/refresh-token', {
          baseURL: import.meta.env.VITE_SSO_BASE || 'https://sso.example.com',
          withCredentials: true,
        });

        const newToken = res.data?.access_token;
        if (!newToken) throw new Error('刷新 token 失败');

        requestQueue.forEach((cb) => cb(newToken));
        requestQueue = [];
        isRefreshing = false;

        // 重新发起原请求
        config.headers.Authorization = `Bearer ${newToken}`;
        return http(config);
      } catch (err) {
        isRefreshing = false;
        requestQueue = [];

        // 刷新失败 → 跳登录
        const currentUrl = window.location.href;
        window.location.href = `/sso/login?redirect=${encodeURIComponent(currentUrl)}`;
        return Promise.reject(err);
      }
    }

    // 通用错误处理
    switch (status) {
      case 403:
        toast.error('没有权限访问');
        break;
      case 404:
        toast.error('接口地址不存在');
        break;
      case 500:
        toast.error(data.message ?? '服务器内部错误');
        break;
      default:
        toast.error(`请求错误：${status}`);
        break;
    }

    return Promise.reject(error);
  }
);

export default async function request<T = unknown>(
  config: AxiosRequestConfig,
): Promise<T> {
  return (http.request(config)) as unknown as T;
}

request.get = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
  request<T>({ ...config, method: 'GET', url });

request.post = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  request<T>({ ...config, method: 'POST', url, data });

request.put = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  request<T>({ ...config, method: 'PUT', url, data });

request.delete = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
  request<T>({ ...config, method: 'DELETE', url })