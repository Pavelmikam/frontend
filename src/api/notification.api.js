import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

// ─── Notifications ────────────────────────────────────────────────────────────

export const getNotifications = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.NOTIFICATIONS, { params });
  return response.data;
};

export const getNotificationUnreadCount = async () => {
  const response = await axiosInstance.get(API_ROUTES.NOTIFICATION_UNREAD_COUNT);
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axiosInstance.post(
    API_ROUTES.NOTIFICATION_MARK_READ(notificationId)
  );
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.post(API_ROUTES.NOTIFICATION_MARK_ALL_READ);
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  await axiosInstance.delete(API_ROUTES.NOTIFICATION_DELETE(notificationId));
};

// ─── Préférences ──────────────────────────────────────────────────────────────

export const getNotificationPreferences = async () => {
  const response = await axiosInstance.get(API_ROUTES.NOTIFICATION_PREFERENCES);
  return response.data;
};

export const updateNotificationPreferences = async (data) => {
  const response = await axiosInstance.put(API_ROUTES.NOTIFICATION_PREFERENCES, data);
  return response.data;
};
