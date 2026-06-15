import { describe, it, expect } from 'vitest';

describe('Immuabilité des messages (règle métier fondamentale)', () => {

  it('messaging.api.js ne doit pas exporter updateMessage', async () => {
    const api = await import('@/api/messaging.api');
    expect(api.updateMessage).toBeUndefined();
  });

  it('messaging.api.js ne doit pas exporter deleteMessage', async () => {
    const api = await import('@/api/messaging.api');
    expect(api.deleteMessage).toBeUndefined();
  });

  it('messaging.api.js exporte bien sendMessage', async () => {
    const api = await import('@/api/messaging.api');
    expect(typeof api.sendMessage).toBe('function');
  });

  it('getMessagesSince est disponible pour le polling', async () => {
    const api = await import('@/api/messaging.api');
    expect(typeof api.getMessagesSince).toBe('function');
  });
});
