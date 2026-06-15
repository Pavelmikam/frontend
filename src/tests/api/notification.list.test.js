import { describe, it, expect, beforeEach } from 'vitest';
import { getNotifications, getNotificationUnreadCount } from '@/api/notification.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API notification.getNotifications', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la liste paginée des notifications', async () => {
    const r = await getNotifications();
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('chaque notification a un UUID comme identifiant', async () => {
    const r = await getNotifications();
    const notif = r.data[0];
    expect(notif).toHaveProperty('id');
    expect(notif.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('la structure NotificationResource est correcte', async () => {
    const r = await getNotifications();
    const notif = r.data[0];
    expect(notif).toHaveProperty('type');
    expect(notif).toHaveProperty('title');
    expect(notif).toHaveProperty('body');
    expect(notif).toHaveProperty('is_read');
    expect(notif).toHaveProperty('data');
    expect(notif).toHaveProperty('created_at');
    expect(notif).not.toHaveProperty('notifiable_id');
    expect(notif).not.toHaveProperty('notifiable_type');
  });

  it('filtre unread=true retourne seulement les non lues', async () => {
    const r = await getNotifications({ unread: true });
    expect(r.data.every((n) => n.is_read === false)).toBe(true);
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getNotifications()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API notification.getNotificationUnreadCount', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne le badge global', async () => {
    const r = await getNotificationUnreadCount();
    expect(r).toHaveProperty('count');
    expect(typeof r.count).toBe('number');
    expect(r.count).toBeGreaterThanOrEqual(0);
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getNotificationUnreadCount()).rejects.toMatchObject({ response: { status: 401 } });
  });
});
