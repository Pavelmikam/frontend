import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

// Paginated list — returns { data: [...], meta: {...} }
export const getProperties = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.PROPERTIES, { params });
  return response.data;
};

export const getProperty = async (id) => {
  const response = await axiosInstance.get(API_ROUTES.PROPERTY(id));
  return response.data;
};

const uploadImagesSequentially = async (propertyId, images) => {
  for (const file of images) {
    const fd = new FormData();
    fd.append('image', file);
    await axiosInstance.post(API_ROUTES.PROPERTY_IMAGES(propertyId), fd);
  }
};

const buildJsonPayload = (data) => {
  const payload = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    payload[key] = value;
  });
  return payload;
};

export const createProperty = async (data, images) => {
  const payload = { transaction_type: 'rent', ...buildJsonPayload(data) };
  const response = await axiosInstance.post(API_ROUTES.PROPERTIES, payload);
  const property = response.data;
  if (images && images.length > 0) {
    try {
      await uploadImagesSequentially(property.id, images);
    } catch {
      // Property was created; flag so callers can show a non-blocking warning.
      property._imageUploadFailed = true;
    }
  }
  return property;
};

export const updateProperty = async (id, data, newImages = []) => {
  const response = await axiosInstance.put(API_ROUTES.PROPERTY(id), buildJsonPayload(data));
  const property = response.data;
  if (newImages && newImages.length > 0) {
    try {
      await uploadImagesSequentially(id, newImages);
    } catch {
      property._imageUploadFailed = true;
    }
  }
  return property;
};

export const deleteProperty = async (id) => {
  await axiosInstance.delete(API_ROUTES.PROPERTY(id));
};

export const submitProperty = async (id) => {
  const response = await axiosInstance.post(API_ROUTES.PROPERTY_SUBMIT(id));
  return response.data;
};

export const archiveProperty = async (id) => {
  const response = await axiosInstance.post(API_ROUTES.PROPERTY_ARCHIVE(id));
  return response.data;
};

export const updatePropertyStatus = async (id, status) => {
  const response = await axiosInstance.patch(API_ROUTES.PROPERTY_STATUS(id), { status });
  return response.data;
};

export const getMyProperties = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.MY_PROPERTIES, { params });
  return response.data;
};

export const addPropertyImages = async (propertyId, images) => {
  const results = [];
  for (const file of images) {
    const fd = new FormData();
    fd.append('image', file);
    const response = await axiosInstance.post(API_ROUTES.PROPERTY_IMAGES(propertyId), fd);
    results.push(response.data);
  }
  return results;
};

export const deletePropertyImage = async (propertyId, imageId) => {
  await axiosInstance.delete(API_ROUTES.PROPERTY_IMAGE(propertyId, imageId));
};

export const reorderPropertyImages = async (propertyId, orderedImages) => {
  await axiosInstance.put(
    API_ROUTES.PROPERTY_IMAGES_REORDER(propertyId),
    { order: orderedImages.map((img) => img.id) }
  );
};

export const setPrimaryImage = async (propertyId, imageId) => {
  const response = await axiosInstance.patch(
    API_ROUTES.PROPERTY_IMAGE_PRIMARY(propertyId, imageId)
  );
  return response.data;
};

export const getPendingProperties = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_PROPERTIES_PENDING, {
    params: { status: 'pending', ...params },
  });
  return response.data;
};

export const getAdminProperties = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_PROPERTIES_PENDING, { params });
  return response.data;
};

export const moderateProperty = async (id, data) => {
  const response = await axiosInstance.post(API_ROUTES.ADMIN_PROPERTY_MODERATE(id), data);
  return response.data;
};

export const getPropertiesMap = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.PROPERTIES_MAP, { params });
  return response.data;
};
