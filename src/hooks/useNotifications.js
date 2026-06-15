import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications, getNotificationUnreadCount,
  markNotificationAsRead, markAllNotificationsAsRead,
  deleteNotification, getNotificationPreferences,
  updateNotificationPreferences,
} from '@/api/notification.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';
import { NOTIFICATION_POLL_INTERVAL } from '@/utils/constants';

export const useNotificationsList = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
    enabled: isAuthenticated,
    staleTime: 1000 * 20,
  });
};

export const useNotificationBadge = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['notificationBadge'],
    queryFn: getNotificationUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: NOTIFICATION_POLL_INTERVAL,
    staleTime: 1000 * 25,
    placeholderData: { count: 0 },
  });
};

export const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['notificationBadge'] });
  };

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => invalidate(),
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      toast.success('Toutes les notifications marquées comme lues.');
      invalidate();
    },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      toast.success('Notification supprimée.', { duration: 2000 });
      invalidate();
    },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  return {
    markRead:    markReadMutation,
    markAllRead: markAllReadMutation,
    delete:      deleteMutation,
  };
};

export const useNotificationPreferences = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: getNotificationPreferences,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      toast.success('Préférences mises à jour.');
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
    onError: (error) => toast.error(error.userMessage || 'Erreur lors de la mise à jour.'),
  });

  return {
    preferences: data,
    isLoading,
    update: updateMutation,
  };
};
