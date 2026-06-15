import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations, getConversation,
  startConversation, markConversationAsRead,
  archiveConversation, unarchiveConversation, getUnreadCount,
} from '@/api/messaging.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export const useConversations = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['conversations', params],
    queryFn: () => getConversations(params),
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });
};

export const useConversation = (id) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const data = await getConversation(id);
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      return data;
    },
    enabled: isAuthenticated && !!id,
  });
};

export const useUnreadCount = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 30000,
    staleTime: 1000 * 20,
    placeholderData: { unread_count: 0 },
  });
};

export const useConversationMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = (id = null) => {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    if (id) queryClient.invalidateQueries({ queryKey: ['conversation', id] });
  };

  const startMutation = useMutation({
    mutationFn: ({ propertyId, data }) => startConversation(propertyId, data),
    onSuccess: () => {
      toast.success('Conversation démarrée.');
      invalidate();
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Erreur lors du démarrage de la conversation.');
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => markConversationAsRead(id),
    onSuccess: (_, id) => invalidate(id),
  });

  const archiveMutation = useMutation({
    mutationFn: (id) => archiveConversation(id),
    onSuccess: (_, id) => {
      toast.success('Conversation archivée.');
      invalidate(id);
    },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  const unarchiveMutation = useMutation({
    mutationFn: (id) => unarchiveConversation(id),
    onSuccess: (_, id) => {
      toast.success('Conversation restaurée.');
      invalidate(id);
    },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  return {
    start:     startMutation,
    markRead:  markReadMutation,
    archive:   archiveMutation,
    unarchive: unarchiveMutation,
  };
};
