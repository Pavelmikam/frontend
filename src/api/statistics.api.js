import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

export const getPropertyStats = async (propertyId, period = '30days') => {
  const response = await axiosInstance.get(
    API_ROUTES.STATISTICS_PROPERTY(propertyId),
    { params: { period } }
  );
  return response.data;
};

export const getOwnerDashboard = async (period = '30days') => {
  const response = await axiosInstance.get(
    API_ROUTES.STATISTICS_OWNER,
    { params: { period } }
  );
  return response.data;
};

export const getTenantDashboard = async (period = '30days') => {
  const response = await axiosInstance.get(
    API_ROUTES.STATISTICS_TENANT,
    { params: { period } }
  );
  return response.data;
};

export const getPopularProperties = async () => {
  const response = await axiosInstance.get(API_ROUTES.PROPERTIES_POPULAR);
  return response.data;
};

export const getAdminAdvancedStats = async (period = '30days', city = null) => {
  const response = await axiosInstance.get(
    API_ROUTES.ADMIN_STATS_ADVANCED,
    { params: { period, ...(city ? { city } : {}) } }
  );
  return response.data;
};

export const getViewsTimeline = async (period = '30days', propertyId = null) => {
  const response = await axiosInstance.get(
    API_ROUTES.ADMIN_STATS_TIMELINE,
    { params: { period, ...(propertyId ? { property_id: propertyId } : {}) } }
  );
  return response.data;
};

export const getTopProperties = async (metric = 'views_count') => {
  const response = await axiosInstance.get(
    API_ROUTES.ADMIN_STATS_TOP,
    { params: { metric } }
  );
  return response.data;
};

export const downloadExport = async (url, params = {}, filename) => {
  const response = await axiosInstance.get(url, {
    params,
    responseType: 'blob',
  });
  const { saveAs } = await import('file-saver');
  saveAs(new Blob([response.data]), filename);
};

export const exportProperties = (filters = {}, format = 'xlsx') =>
  downloadExport(
    API_ROUTES.EXPORT_PROPERTIES,
    { ...filters, format },
    `annonces_${new Date().toISOString().slice(0, 10)}.${format}`
  );

export const exportUsers = (role = null, isActive = null, format = 'xlsx') =>
  downloadExport(
    API_ROUTES.EXPORT_USERS,
    { ...(role ? { role } : {}), ...(isActive !== null ? { is_active: isActive } : {}), format },
    `utilisateurs_${new Date().toISOString().slice(0, 10)}.${format}`
  );

export const exportRentalRequests = (status = null, propertyId = null, format = 'xlsx') =>
  downloadExport(
    API_ROUTES.EXPORT_RENTAL_REQUESTS,
    {
      ...(status ? { status } : {}),
      ...(propertyId ? { property_id: propertyId } : {}),
      format,
    },
    `demandes_${new Date().toISOString().slice(0, 10)}.${format}`
  );

export const exportActivityReport = (period = '30days') =>
  downloadExport(
    API_ROUTES.EXPORT_ACTIVITY_REPORT,
    { period },
    `rapport_activite_${new Date().toISOString().slice(0, 10)}.pdf`
  );

export const exportPropertyReport = (propertyId, period = '30days') =>
  downloadExport(
    API_ROUTES.EXPORT_PROPERTY_REPORT(propertyId),
    { period },
    `rapport_annonce_${propertyId}_${new Date().toISOString().slice(0, 10)}.pdf`
  );
