import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

export const getFavorites = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.FAVORITES, { params });
  return response.data;
};

export const toggleFavorite = async (propertyId) => {
  const response = await axiosInstance.post(API_ROUTES.FAVORITE_TOGGLE(propertyId));
  return response.data;
};

export const checkFavorite = async (propertyId) => {
  const response = await axiosInstance.get(API_ROUTES.FAVORITE_CHECK(propertyId));
  return response.data;
};
