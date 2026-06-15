import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

export const reportProperty = async (propertyId, data) => {
  const response = await axiosInstance.post(API_ROUTES.REPORT_PROPERTY(propertyId), data);
  return response.data;
};

export const reportMessage = async (messageId, data) => {
  const response = await axiosInstance.post(API_ROUTES.REPORT_MESSAGE(messageId), data);
  return response.data;
};
