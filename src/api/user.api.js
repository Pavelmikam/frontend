import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

export const getProfile = async () => {
  const response = await axiosInstance.get(API_ROUTES.USER_PROFILE);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.put(API_ROUTES.USER_PROFILE, data);
  return response.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await axiosInstance.post(API_ROUTES.USER_AVATAR, formData);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await axiosInstance.put(API_ROUTES.USER_PASSWORD, data);
  return response.data;
};
