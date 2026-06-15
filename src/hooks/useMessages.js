import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, sendMessage, getMessagesSince } from '@/api/messaging.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';
import { MESSAGING_POLL_INTERVAL } from '@/utils/constants';

export const useMessages = (conversationId, params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['messages', conversationId, params],
    queryFn: () => getMessages(conversationId, params),
    enabled: isAuthenticated && !!conversationId,
  });
};

export const useMessagesPolling = (conversationId, isActive = true) => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const lastIdRef = useRef(0);
  const intervalRef = useRef(null);

  const { isLoading } = useQuery({
    queryKey: ['messagesInitial', conversationId],
    queryFn: () => getMessages(conversationId, { per_page: 50 }),
    enabled: isAuthenticated && !!conversationId,
    onSuccess: (data) => {
      const items = data?.data ?? [];
      setMessages(items);
      if (items.length > 0) {
        lastIdRef.current = items[items.length - 1]?.id ?? 0;
      }
    },
  });

  const poll = useCallback(async () => {
    if (!conversationId || !isAuthenticated) return;
    if (document.visibilityState !== 'visible') return;
    try {
      const data = await getMessagesSince(conversationId, lastIdRef.current);
      const newMessages = data?.data ?? [];
      if (newMessages.length > 0) {
        setMessages((prev) => [...prev, ...newMessages]);
        lastIdRef.current = newMessages[newMessages.length - 1]?.id ?? lastIdRef.current;
      }
    } catch {
      // Silencieux
    }
  }, [conversationId, isAuthenticated]);

  useEffect(() => {
    if (!isActive || !conversationId || !isAuthenticated) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(poll, MESSAGING_POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, conversationId, isAuthenticated, poll]);

  // Reprendre le polling quand la fenêtre redevient visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        poll();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, poll]);

  return { messages, setMessages, isLoading, lastMessageId: lastIdRef.current };
};

export const useSendMessage = (conversationId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, attachments }) => {
      if (!body?.trim()) return Promise.reject(new Error('EMPTY_MESSAGE'));
      if (body.length > 2000) {
        toast.error('Message trop long (max 2000 caractères).');
        return Promise.reject(new Error('MESSAGE_TOO_LONG'));
      }
      if (attachments?.length > 0) {
        for (const file of attachments) {
          if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Format non supporté. JPG, PNG, WebP ou PDF uniquement.');
            return Promise.reject(new Error('INVALID_FILE_TYPE'));
          }
          if (file.size > 5 * 1024 * 1024) {
            toast.error('Fichier trop lourd. Maximum 5 Mo par pièce jointe.');
            return Promise.reject(new Error('FILE_TOO_LARGE'));
          }
        }
        if (attachments.length > 3) {
          toast.error('Maximum 3 pièces jointes par message.');
          return Promise.reject(new Error('TOO_MANY_ATTACHMENTS'));
        }
      }
      return sendMessage(conversationId, body, attachments ?? []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messagesInitial', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      const clientErrors = [
        'EMPTY_MESSAGE', 'MESSAGE_TOO_LONG', 'INVALID_FILE_TYPE',
        'FILE_TOO_LARGE', 'TOO_MANY_ATTACHMENTS',
      ];
      if (!clientErrors.includes(error.message)) {
        toast.error(error.userMessage || "Erreur lors de l'envoi du message.");
      }
    },
  });
};
