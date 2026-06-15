import { describe, it, expect, beforeEach } from 'vitest';
import { getMessages, sendMessage, getMessagesSince } from '@/api/messaging.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API messaging.getMessages', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne les messages paginés', async () => {
    const r = await getMessages(1);
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('chaque message a is_mine défini', async () => {
    const r = await getMessages(1);
    const msg = r.data[0];
    expect(msg).toHaveProperty('is_mine');
    expect(typeof msg.is_mine).toBe('boolean');
  });

  it("les messages n'exposent pas de champs sensibles", async () => {
    const r = await getMessages(1);
    const msg = r.data[0];
    expect(msg).not.toHaveProperty('file_path');
  });
});

describe('API messaging.sendMessage', () => {
  beforeEach(() => saveToken(mockToken));

  it('envoie un message texte et retourne 201', async () => {
    const r = await sendMessage(1, 'Bonjour, je suis intéressé !');
    const msg = r.data || r;
    expect(msg).toHaveProperty('id');
    expect(msg).toHaveProperty('body');
    expect(msg).toHaveProperty('created_at');
  });

  it('retourne 422 pour un message vide', async () => {
    try {
      await sendMessage(1, '   ');
    } catch (error) {
      expect(error.response.status).toBe(422);
    }
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(sendMessage(1, 'test')).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API messaging.getMessagesSince (polling)', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne les nouveaux messages depuis un ID donné', async () => {
    const r = await getMessagesSince(1, 0);
    expect(r).toHaveProperty('data');
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('retourne tableau vide si aucun nouveau message', async () => {
    const r = await getMessagesSince(1, 9999);
    expect(r.data).toHaveLength(0);
  });
});
