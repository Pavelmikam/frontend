import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

export const getSavedSearches = async () => {
  const response = await axiosInstance.get(API_ROUTES.SAVED_SEARCHES);
  return response.data;
};

export const createSavedSearch = async (data) => {
  const response = await axiosInstance.post(API_ROUTES.SAVED_SEARCHES, data);
  return response.data;
};

export const updateSavedSearch = async (id, data) => {
  const response = await axiosInstance.put(API_ROUTES.SAVED_SEARCH(id), data);
  return response.data;
};

export const deleteSavedSearch = async (id) => {
  await axiosInstance.delete(API_ROUTES.SAVED_SEARCH(id));
};

export const toggleSavedSearchNotifications = async (id) => {
  const response = await axiosInstance.patch(API_ROUTES.SAVED_SEARCH_TOGGLE_NOTIF(id));
  return response.data;
};

export const getSavedSearchResults = async (id, params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.SAVED_SEARCH_RESULTS(id), { params });
  return response.data;
};
