import axios from 'axios';
import { getToken, removeToken } from '@/utils/tokenUtils';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (status === 419 && !originalRequest._csrfRetry) {
      originalRequest._csrfRetry = true;
      await axiosInstance.get('/sanctum/csrf-cookie');
      return axiosInstance(originalRequest);
    }

    if (status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    if (status === 422 && error.response?.data?.errors) {
      error.validationErrors = error.response.data.errors;
    }

    error.userMessage = error.response?.data?.message
      || 'Une erreur est survenue. Veuillez réessayer.';

    return Promise.reject(error);
  }
);

export default axiosInstance;
