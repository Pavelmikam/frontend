import { describe, it, expect, beforeEach } from 'vitest';
import {
  getConversations, getConversation, startConversation,
  markConversationAsRead, archiveConversation,
  unarchiveConversation, getUnreadCount,
} from '@/api/messaging.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API messaging.getConversations', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la liste paginée des conversations', async () => {
    const r = await getConversations();
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('chaque conversation a un other_participant', async () => {
    const r = await getConversations();
    const conv = r.data[0];
    expect(conv).toHaveProperty('other_participant');
    expect(conv.other_participant).toHaveProperty('name');
    expect(conv).not.toHaveProperty('file_path');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getConversations()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API messaging.getConversation', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la conversation avec les messages', async () => {
    const r = await getConversation(1);
    expect(r).toHaveProperty('conversation');
    expect(r).toHaveProperty('messages');
    expect(Array.isArray(r.messages.data)).toBe(true);
  });

  it('retourne 404 pour une conversation inexistante', async () => {
    await expect(getConversation(999)).rejects.toMatchObject({ response: { status: 404 } });
  });
});

describe('API messaging.startConversation', () => {
  beforeEach(() => saveToken(mockToken));

  it('démarre une conversation et retourne 201', async () => {
    const r = await startConversation(1, { initial_message: 'Bonjour, est-ce disponible ?' });
    const conv = r.data || r;
    expect(conv).toHaveProperty('id');
    expect(conv).toHaveProperty('property');
  });

  it('retourne 422 si message initial trop court', async () => {
    try {
      await startConversation(1, { initial_message: 'Hi' });
    } catch (error) {
      expect(error.response.status).toBe(422);
      expect(error.validationErrors).toHaveProperty('initial_message');
    }
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(startConversation(1, { initial_message: 'Test long' })).rejects.toMatchObject({
      response: { status: 401 },
    });
  });
});

describe('API messaging.markConversationAsRead', () => {
  beforeEach(() => saveToken(mockToken));

  it('marque comme lu et retourne unread_count=0', async () => {
    const r = await markConversationAsRead(1);
    expect(r).toHaveProperty('unread_count', 0);
  });
});

describe('API messaging.archiveConversation', () => {
  beforeEach(() => saveToken(mockToken));

  it('archive une conversation', async () => {
    const r = await archiveConversation(1);
    expect(r).toHaveProperty('message');
    expect(r.message).toContain('archivée');
  });
});

describe('API messaging.unarchiveConversation', () => {
  beforeEach(() => saveToken(mockToken));

  it('désarchive une conversation', async () => {
    const r = await unarchiveConversation(1);
    expect(r).toHaveProperty('message');
    expect(r.message).toContain('restaurée');
  });
});

describe('API messaging.getUnreadCount', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne le badge global non-lus', async () => {
    const r = await getUnreadCount();
    expect(r).toHaveProperty('unread_count');
    expect(typeof r.unread_count).toBe('number');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getUnreadCount()).rejects.toMatchObject({ response: { status: 401 } });
  });
});
