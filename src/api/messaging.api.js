import axiosInstance from './axiosInstance';
import { API_ROUTES } from '@/utils/constants';

// ─── Conversations ────────────────────────────────────────────────────────────

export const getConversations = async (params = {}) => {
  const response = await axiosInstance.get(API_ROUTES.CONVERSATIONS, { params });
  return response.data;
};

export const getConversation = async (id) => {
  const response = await axiosInstance.get(API_ROUTES.CONVERSATION(id));
  return response.data;
};

export const startConversation = async (propertyId, data) => {
  const response = await axiosInstance.post(
    API_ROUTES.CONVERSATION_START(propertyId),
    data
  );
  return response.data;
};

export const markConversationAsRead = async (id) => {
  const response = await axiosInstance.post(API_ROUTES.CONVERSATION_MARK_READ(id));
  return response.data;
};

export const archiveConversation = async (id) => {
  const response = await axiosInstance.post(API_ROUTES.CONVERSATION_ARCHIVE(id));
  return response.data;
};

export const unarchiveConversation = async (id) => {
  const response = await axiosInstance.post(API_ROUTES.CONVERSATION_UNARCHIVE(id));
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get(API_ROUTES.MESSAGING_UNREAD_COUNT);
  return response.data;
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const getMessages = async (conversationId, params = {}) => {
  const response = await axiosInstance.get(
    API_ROUTES.CONVERSATION_MESSAGES(conversationId),
    { params }
  );
  return response.data;
};

export const sendMessage = async (conversationId, body, attachments = []) => {
  if (attachments.length === 0) {
    const response = await axiosInstance.post(
      API_ROUTES.CONVERSATION_MESSAGES(conversationId),
      { body }
    );
    return response.data;
  }

  const formData = new FormData();
  formData.append('body', body);
  attachments.forEach((file) => formData.append('attachments[]', file));

  const response = await axiosInstance.post(
    API_ROUTES.CONVERSATION_MESSAGES(conversationId),
    formData
  );
  return response.data;
};

export const getMessagesSince = async (conversationId, sinceId = 0) => {
  const response = await axiosInstance.get(
    API_ROUTES.CONVERSATION_MESSAGES_SINCE(conversationId),
    { params: { since_id: sinceId } }
  );
  return response.data;
};

// ⚠️ Pas de updateMessage() ni deleteMessage() — messages immuables
