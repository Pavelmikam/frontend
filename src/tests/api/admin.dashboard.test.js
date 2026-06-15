import { describe, it, expect, beforeEach } from 'vitest';
import { getAdminDashboard } from '@/api/admin.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API admin.getAdminDashboard', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne les KPIs principaux', async () => {
    const r = await getAdminDashboard();
    expect(r).toHaveProperty('stats');
    const { stats } = r;
    expect(stats).toHaveProperty('total_users');
    expect(stats).toHaveProperty('total_locataires');
    expect(stats).toHaveProperty('total_proprietaires');
    expect(stats).toHaveProperty('active_properties');
    expect(stats).toHaveProperty('pending_properties');
    expect(stats).toHaveProperty('pending_reports');
    expect(typeof stats.total_users).toBe('number');
  });

  it('retourne les données pour les graphiques', async () => {
    const r = await getAdminDashboard();
    expect(r).toHaveProperty('charts');
    const { charts } = r;
    expect(charts).toHaveProperty('registrations_per_month');
    expect(charts).toHaveProperty('properties_per_month');
    expect(Array.isArray(charts.registrations_per_month)).toBe(true);
    expect(Array.isArray(charts.properties_per_month)).toBe(true);
  });

  it('chaque entrée registrations_per_month a month et count', async () => {
    const r = await getAdminDashboard();
    const entry = r.charts.registrations_per_month[0];
    expect(entry).toHaveProperty('month');
    expect(entry).toHaveProperty('count');
  });

  it('chaque entrée properties_per_month a submitted/approved/rejected', async () => {
    const r = await getAdminDashboard();
    const entry = r.charts.properties_per_month[0];
    expect(entry).toHaveProperty('submitted');
    expect(entry).toHaveProperty('approved');
    expect(entry).toHaveProperty('rejected');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getAdminDashboard()).rejects.toMatchObject({ response: { status: 401 } });
  });
});
