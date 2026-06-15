import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getAdminDashboard = async () => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_DASHBOARD);
  return response.data;
};

// ─── Gestion des utilisateurs ─────────────────────────────────────────────────

export const getAdminUsers = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_USERS, { params });
  return response.data;
};

export const getAdminUser = async (id) => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_USER(id));
  return response.data;
};

export const suspendUser = async (id, reason) => {
  const response = await axiosInstance.post(API_ROUTES.ADMIN_USER_SUSPEND(id), { reason });
  return response.data;
};

export const activateUser = async (id) => {
  const response = await axiosInstance.post(API_ROUTES.ADMIN_USER_ACTIVATE(id));
  return response.data;
};

export const deleteAdminUser = async (id) => {
  await axiosInstance.delete(API_ROUTES.ADMIN_USER_DELETE(id));
};

export const restoreUser = async (id) => {
  const response = await axiosInstance.post(API_ROUTES.ADMIN_USER_RESTORE(id));
  return response.data;
};

// ─── Signalements ─────────────────────────────────────────────────────────────

export const getAdminReports = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_REPORTS, { params });
  return response.data;
};

export const getAdminReport = async (id) => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_REPORT(id));
  return response.data;
};

export const handleReport = async (id, data) => {
  const response = await axiosInstance.post(API_ROUTES.ADMIN_REPORT_HANDLE(id), data);
  return response.data;
};

// ─── Catégories & équipements ─────────────────────────────────────────────────

export const getAdminAmenityCategories = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_AMENITY_CATEGORIES, { params });
  return response.data;
};

export const createAmenityCategory = async (data) => {
  const response = await axiosInstance.post(API_ROUTES.ADMIN_AMENITY_CATEGORIES, data);
  return response.data;
};

export const updateAmenityCategory = async (id, data) => {
  const response = await axiosInstance.put(API_ROUTES.ADMIN_AMENITY_CATEGORY(id), data);
  return response.data;
};

export const disableAmenityCategory = async (id) => {
  await axiosInstance.delete(API_ROUTES.ADMIN_AMENITY_CATEGORY(id));
};

// ─── Journal admin ─────────────────────────────────────────────────────────────

export const getAdminLogs = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_LOGS, { params });
  return response.data;
};
