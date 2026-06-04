import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

// ─── Demandes ────────────────────────────────────────────────────────────────

export const getRentalRequests = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.RENTAL_REQUESTS, { params });
  return response.data;
};

export const getRentalRequest = async (id) => {
  const response = await axiosInstance.get(API_ROUTES.RENTAL_REQUEST(id));
  return response.data;
};

export const createRentalRequest = async (propertyId, data = {}) => {
  const response = await axiosInstance.post(
    API_ROUTES.RENTAL_REQUEST_STORE(propertyId),
    data
  );
  return response.data;
};

export const decideRentalRequest = async (id, data) => {
  const response = await axiosInstance.post(
    API_ROUTES.RENTAL_REQUEST_DECIDE(id),
    data
  );
  return response.data;
};

export const cancelRentalRequest = async (id) => {
  const response = await axiosInstance.post(
    API_ROUTES.RENTAL_REQUEST_CANCEL(id)
  );
  return response.data;
};

export const scheduleVisit = async (id, visitScheduledAt) => {
  const response = await axiosInstance.post(
    API_ROUTES.RENTAL_REQUEST_SCHEDULE(id),
    { visit_scheduled_at: visitScheduledAt }
  );
  return response.data;
};

export const confirmVisit = async (id) => {
  const response = await axiosInstance.post(
    API_ROUTES.RENTAL_REQUEST_CONFIRM_VISIT(id)
  );
  return response.data;
};

// ─── Documents du dossier locatif ────────────────────────────────────────────

export const uploadDocument = async (rentalRequestId, file, type, description = '') => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('type', type);
  if (description) formData.append('description', description);

  const response = await axiosInstance.post(
    API_ROUTES.RENTAL_REQUEST_DOCUMENTS(rentalRequestId),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

export const deleteDocument = async (rentalRequestId, documentId) => {
  await axiosInstance.delete(
    API_ROUTES.RENTAL_REQUEST_DOCUMENT(rentalRequestId, documentId)
  );
};

export const getDocumentDownloadUrl = async (documentId) => {
  const response = await axiosInstance.get(
    API_ROUTES.DOCUMENT_DOWNLOAD(documentId)
  );
  return response.data;
};

export const verifyDocument = async (documentId) => {
  const response = await axiosInstance.post(
    API_ROUTES.DOCUMENT_VERIFY(documentId)
  );
  return response.data;
};
