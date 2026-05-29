import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

const getCsrfCookie = () => axiosInstance.get('/sanctum/csrf-cookie');

export const register = async (data) => {
  await getCsrfCookie();
  const response = await axiosInstance.post(API_ROUTES.AUTH_REGISTER, data);
  return response.data;
};

export const login = async (credentials) => {
  await getCsrfCookie();
  const response = await axiosInstance.post(API_ROUTES.AUTH_LOGIN, credentials);
  return response.data;
};

export const logout = async () => {
  await axiosInstance.post(API_ROUTES.AUTH_LOGOUT);
};

export const getMe = async () => {
  const response = await axiosInstance.get(API_ROUTES.AUTH_ME);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH_FORGOT_PASSWORD, { email });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH_RESET_PASSWORD, data);
  return response.data;
};

export const resendVerification = async () => {
  const response = await axiosInstance.post(API_ROUTES.AUTH_RESEND_VERIFY);
  return response.data;
};
