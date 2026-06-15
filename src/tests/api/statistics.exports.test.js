import { describe, it, expect, beforeEach } from 'vitest';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('Exports — getPropertyStats structure', () => {
  beforeEach(() => saveToken(mockToken));

  it('conversion_rate est un nombre entre 0 et 100', async () => {
    const { getPropertyStats } = await import('@/api/statistics.api');
    const r = await getPropertyStats(1);
    expect(typeof r.data.conversion_rate).toBe('number');
    expect(r.data.conversion_rate).toBeGreaterThanOrEqual(0);
    expect(r.data.conversion_rate).toBeLessThanOrEqual(100);
  });

  it('by_day est un objet clé=date valeur=nombre', async () => {
    const { getPropertyStats } = await import('@/api/statistics.api');
    const r = await getPropertyStats(1);
    const byDay = r.data.views.by_day;
    expect(typeof byDay).toBe('object');
    Object.values(byDay).forEach((count) => {
      expect(typeof count).toBe('number');
    });
  });

  it('requests contient les clés de statut attendues', async () => {
    const { getPropertyStats } = await import('@/api/statistics.api');
    const r = await getPropertyStats(1);
    const req = r.data.requests;
    expect(req).toHaveProperty('total');
    expect(req).toHaveProperty('en_attente');
    expect(req).toHaveProperty('acceptees');
    expect(req).toHaveProperty('refusees');
  });
});

describe('Exports — downloadExport wrapper', () => {
  it('l\'endpoint blob retourne un statut 200 avec contenu binaire', async () => {
    saveToken(mockToken);
    const axiosInstance = (await import('@/api/axiosInstance')).default;
    const r = await axiosInstance.get('/api/admin/export/activity-report', {
      params: { period: '30days' },
      responseType: 'blob',
    });
    expect(r.status).toBe(200);
    expect(r.data).toBeDefined();
  });
});
