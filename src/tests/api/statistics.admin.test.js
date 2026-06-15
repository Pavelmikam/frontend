import { describe, it, expect, beforeEach } from 'vitest';
import { getAdminAdvancedStats, getViewsTimeline, getTopProperties } from '@/api/statistics.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API admin.statistics.getAdminAdvancedStats', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne les stats avancées', async () => {
    const r = await getAdminAdvancedStats('30days');
    const data = r.data;
    expect(data).toHaveProperty('top_cities');
    expect(data).toHaveProperty('top_types');
    expect(data).toHaveProperty('acceptance_rate');
    expect(data).toHaveProperty('avg_price_by_city');
    expect(Array.isArray(data.top_cities)).toBe(true);
    expect(data.top_cities[0]).toHaveProperty('city');
    expect(data.top_cities[0]).toHaveProperty('count');
  });

  it('le taux d\'acceptation est un nombre entre 0 et 100', async () => {
    const r = await getAdminAdvancedStats('30days');
    expect(typeof r.data.acceptance_rate).toBe('number');
    expect(r.data.acceptance_rate).toBeGreaterThanOrEqual(0);
    expect(r.data.acceptance_rate).toBeLessThanOrEqual(100);
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getAdminAdvancedStats()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.statistics.getViewsTimeline', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la timeline des vues', async () => {
    const r = await getViewsTimeline('30days');
    expect(r).toHaveProperty('data');
    expect(Array.isArray(r.data)).toBe(true);
    if (r.data.length > 0) {
      expect(r.data[0]).toHaveProperty('date');
      expect(r.data[0]).toHaveProperty('total_views');
      expect(r.data[0]).toHaveProperty('unique_views');
    }
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getViewsTimeline()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.statistics.getTopProperties', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne les top annonces par métrique valide', async () => {
    const r = await getTopProperties('views_count');
    expect(r).toHaveProperty('data');
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('accepte les 3 métriques valides', async () => {
    const metrics = ['views_count', 'favorites_count', 'requests_count'];
    for (const metric of metrics) {
      const r = await getTopProperties(metric);
      expect(r).toHaveProperty('data');
    }
  });

  it('retourne 422 pour une métrique invalide', async () => {
    await expect(getTopProperties('invalid_metric')).rejects.toMatchObject({
      response: { status: 422 },
    });
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getTopProperties('views_count')).rejects.toMatchObject({ response: { status: 401 } });
  });
});
