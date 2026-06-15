import { describe, it, expect, beforeEach } from 'vitest';
import { getAdminLogs } from '@/api/admin.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken, mockAdminLog } from '../mocks/handlers';

describe('API admin.getAdminLogs', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la liste paginée des logs admin', async () => {
    const r = await getAdminLogs();
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
    expect(Array.isArray(r.data)).toBe(true);
    expect(r.data.length).toBeGreaterThan(0);
  });

  it('chaque log a les champs de structure attendus', async () => {
    const r = await getAdminLogs();
    const log = r.data[0];
    expect(log).toHaveProperty('id');
    expect(log).toHaveProperty('action');
    expect(log).toHaveProperty('admin');
    expect(log).toHaveProperty('loggable_type');
    expect(log).toHaveProperty('loggable_id');
    expect(log).toHaveProperty('ip_address');
    expect(log).toHaveProperty('created_at');
  });

  it('les champs before et after contiennent les états avant/après', async () => {
    const r = await getAdminLogs();
    const log = r.data[0];
    expect(log).toHaveProperty('before');
    expect(log).toHaveProperty('after');
    expect(log.before).toMatchObject({ is_active: true });
    expect(log.after).toMatchObject({ is_active: false });
  });

  it('l\'admin est un objet avec id et name', async () => {
    const r = await getAdminLogs();
    const log = r.data[0];
    expect(log.admin).toHaveProperty('id');
    expect(log.admin).toHaveProperty('name');
    expect(typeof log.admin.name).toBe('string');
  });

  it('le journal contient plusieurs actions différentes', async () => {
    const r = await getAdminLogs();
    const actions = r.data.map((l) => l.action);
    expect(actions).toContain(mockAdminLog.action);
    expect(actions.length).toBeGreaterThanOrEqual(2);
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getAdminLogs()).rejects.toMatchObject({ response: { status: 401 } });
  });
});
