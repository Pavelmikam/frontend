import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

// ─── Endpoints publics (sans auth) ──────────────────────────────────────────

export const getNeighborhoodScore = async (latitude, longitude, radius_km = 2) => {
  const response = await axiosInstance.get(API_ROUTES.NEIGHBORHOOD_SCORE, {
    params: { latitude, longitude, radius_km },
  });
  return response.data;
};

export const getPropertyNeighborhoodScore = async (propertyId) => {
  const response = await axiosInstance.get(
    API_ROUTES.NEIGHBORHOOD_PROPERTY_SCORE(propertyId)
  );
  return response.data;
};

export const getNeighborhoodHistory = async (city, neighborhood, criterion) => {
  const response = await axiosInstance.get(API_ROUTES.NEIGHBORHOOD_HISTORY, {
    params: { city, neighborhood, criterion },
  });
  return response.data;
};

// ─── Endpoints authentifiés ──────────────────────────────────────────────────

export const submitNeighborhoodReport = async (data) => {
  const response = await axiosInstance.post(API_ROUTES.NEIGHBORHOOD_SUBMIT, data);
  return response.data;
};

export const getMyNeighborhoodReports = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.NEIGHBORHOOD_MY_REPORTS, { params });
  return response.data;
};

export const getMyContributorProfile = async () => {
  const response = await axiosInstance.get(API_ROUTES.NEIGHBORHOOD_MY_PROFILE);
  return response.data;
};

// ─── Endpoints admin ─────────────────────────────────────────────────────────

export const getAdminNeighborhoodReports = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.ADMIN_NEIGHBORHOOD_REPORTS, { params });
  return response.data;
};

export const flagNeighborhoodReport = async (id) => {
  const response = await axiosInstance.post(API_ROUTES.ADMIN_NEIGHBORHOOD_FLAG(id));
  return response.data;
};

export const validateNeighborhoodReport = async (id) => {
  const response = await axiosInstance.post(API_ROUTES.ADMIN_NEIGHBORHOOD_VALIDATE(id));
  return response.data;
};

export const recomputeNeighborhoodScores = async (city, neighborhood = null) => {
  const response = await axiosInstance.post(API_ROUTES.ADMIN_NEIGHBORHOOD_RECOMPUTE, {
    city,
    neighborhood,
  });
  return response.data;
};
