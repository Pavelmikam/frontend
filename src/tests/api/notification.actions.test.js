import { describe, it, expect, beforeEach } from 'vitest';
import {
  markNotificationAsRead, markAllNotificationsAsRead, deleteNotification,
} from '@/api/notification.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken, mockNotification } from '../mocks/handlers';

describe('API notification.markNotificationAsRead', () => {
  beforeEach(() => saveToken(mockToken));

  it('marque une notification comme lue', async () => {
    const r = await markNotificationAsRead(mockNotification.id);
    expect(r).toHaveProperty('message');
    expect(r).toHaveProperty('data');
    expect(r.data.is_read).toBe(true);
    expect(r.data.read_at).not.toBeNull();
  });

  it("retourne 404 pour une notification d'un autre user", async () => {
    await expect(
      markNotificationAsRead('00000000-0000-0000-0000-000000000000')
    ).rejects.toMatchObject({ response: { status: 404 } });
  });
});

describe('API notification.markAllNotificationsAsRead', () => {
  beforeEach(() => saveToken(mockToken));

  it('marque toutes comme lues et retourne count=0', async () => {
    const r = await markAllNotificationsAsRead();
    expect(r).toHaveProperty('message');
    expect(r.count).toBe(0);
  });
});

describe('API notification.deleteNotification', () => {
  beforeEach(() => saveToken(mockToken));

  it('supprime une notification (204)', async () => {
    await expect(deleteNotification(mockNotification.id)).resolves.not.toThrow();
  });

  it("retourne 404 pour une notification d'un autre user", async () => {
    await expect(
      deleteNotification('00000000-0000-0000-0000-000000000000')
    ).rejects.toMatchObject({ response: { status: 404 } });
  });
});
