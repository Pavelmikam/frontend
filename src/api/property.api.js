import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

// Paginated list — returns { data: [...], meta: {...} }
export const getProperties = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.PROPERTIES, { params });
  return response.data;
};

// Single resource — unwraps Laravel's { data: {...} } envelope
export const getProperty = async (id) => {
  const response = await axiosInstance.get(API_ROUTES.PROPERTY(id));
  return response.data.data;
};

export const createProperty = async (data, images) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, value);
    }
  });
  images.forEach((file) => formData.append('images[]', file));
  const response = await axiosInstance.post(API_ROUTES.PROPERTIES, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const updateProperty = async (id, data, newImages = []) => {
  const formData = new FormData();
  formData.append('_method', 'PUT');
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, value);
    }
  });
  newImages.forEach((file) => formData.append('images[]', file));
  const response = await axiosInstance.post(API_ROUTES.PROPERTY(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const deleteProperty = async (id) => {
  await axiosInstance.delete(API_ROUTES.PROPERTY(id));
};

export const updatePropertyStatus = async (id, status) => {
  const response = await axiosInstance.patch(API_ROUTES.PROPERTY_STATUS(id), { status });
  return response.data.data;
};

export const getMyProperties = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.MY_PROPERTIES, { params });
  return response.data;
};

export const addPropertyImages = async (propertyId, images) => {
  const formData = new FormData();
  images.forEach((file) => formData.append('images[]', file));
  const response = await axiosInstance.post(API_ROUTES.PROPERTY_IMAGES(propertyId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const deletePropertyImage = async (propertyId, imageId) => {
  await axiosInstance.delete(API_ROUTES.PROPERTY_IMAGE(propertyId, imageId));
};

export const reorderPropertyImages = async (propertyId, orderedImages) => {
  await axiosInstance.patch(
    API_ROUTES.PROPERTY_IMAGES_REORDER(propertyId),
    { images: orderedImages }
  );
};

export const setPrimaryImage = async (propertyId, imageId) => {
  const response = await axiosInstance.patch(
    API_ROUTES.PROPERTY_IMAGE_PRIMARY(propertyId, imageId)
  );
  return response.data.data;
};

export const getPendingProperties = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_PROPERTIES_PENDING, { params });
  return response.data;
};

export const moderateProperty = async (id, data) => {
  const response = await axiosInstance.post(API_ROUTES.ADMIN_PROPERTY_MODERATE(id), data);
  return response.data.data;
};

export const getPropertiesMap = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.PROPERTIES_MAP, { params });
  return response.data;
};
