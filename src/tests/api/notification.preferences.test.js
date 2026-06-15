import { describe, it, expect, beforeEach } from 'vitest';
import { getNotificationPreferences, updateNotificationPreferences } from '@/api/notification.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API notification.getNotificationPreferences', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne les préférences avec channels, enabled_types et available_types', async () => {
    const r = await getNotificationPreferences();
    expect(r).toHaveProperty('channels');
    expect(r).toHaveProperty('enabled_types');
    expect(r).toHaveProperty('available_types');
    expect(r.channels).toHaveProperty('mail');
    expect(r.channels).toHaveProperty('database');
  });

  it('available_types contient tous les types connus', async () => {
    const r = await getNotificationPreferences();
    expect(r.available_types).toContain('rental_request_received');
    expect(r.available_types).toContain('message_received');
    expect(r.available_types).toContain('property_approved');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getNotificationPreferences()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API notification.updateNotificationPreferences', () => {
  beforeEach(() => saveToken(mockToken));

  it('désactive le canal email', async () => {
    const r = await updateNotificationPreferences({ channels: { mail: false } });
    expect(r).toHaveProperty('message');
    expect(r.channels.mail).toBe(false);
  });

  it('désactive un type de notification', async () => {
    const r = await updateNotificationPreferences({
      enabled_types: { message_received: false },
    });
    expect(r.enabled_types.message_received).toBe(false);
  });

  it('mise à jour partielle ne touche pas les autres champs', async () => {
    const r = await updateNotificationPreferences({ channels: { mail: false } });
    expect(r.channels).toHaveProperty('database');
  });
});
