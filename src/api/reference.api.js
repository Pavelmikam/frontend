import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

export const getReferenceAmenities = async () => {
  const response = await axiosInstance.get(API_ROUTES.REFERENCE_AMENITIES);
  return response.data;
};

export const getReferencePropertyTypes = async () => {
  const response = await axiosInstance.get(API_ROUTES.REFERENCE_PROPERTY_TYPES);
  return response.data;
};

export const getReferenceCharges = async () => {
  const response = await axiosInstance.get(API_ROUTES.REFERENCE_CHARGES);
  return response.data;
};
