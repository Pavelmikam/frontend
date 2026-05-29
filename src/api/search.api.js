import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

export const searchProperties = async (filters = {}) => {
  const response = await axiosInstance.get(API_ROUTES.PROPERTIES, {
    params: filters,
  });
  return response.data;
};

export const getPropertiesForMap = async (filters = {}) => {
  const response = await axiosInstance.get(API_ROUTES.PROPERTIES_MAP, {
    params: filters,
  });
  return response.data;
};
