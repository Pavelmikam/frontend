import { describe, it, expect, beforeEach } from 'vitest';
import { getPropertyStats, getOwnerDashboard, getTenantDashboard, getPopularProperties } from '@/api/statistics.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API statistics.getPropertyStats', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne les stats d\'une annonce', async () => {
    const r = await getPropertyStats(1, '30days');
    expect(r).toHaveProperty('data');
    const data = r.data;
    expect(data).toHaveProperty('views');
    expect(data).toHaveProperty('requests');
    expect(data).toHaveProperty('conversion_rate');
    expect(data).toHaveProperty('favorites_count');
    expect(data.views).toHaveProperty('total');
    expect(data.views).toHaveProperty('unique');
    expect(data.views).toHaveProperty('by_day');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getPropertyStats(1)).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API statistics.getOwnerDashboard', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne le dashboard propriétaire complet', async () => {
    const r = await getOwnerDashboard('30days');
    const data = r.data;
    expect(data).toHaveProperty('properties');
    expect(data.properties).toHaveProperty('total');
    expect(data.properties).toHaveProperty('active');
    expect(data).toHaveProperty('views_total');
    expect(data).toHaveProperty('requests_total');
    expect(data).toHaveProperty('potential_revenue');
    expect(data).toHaveProperty('top_properties');
    expect(Array.isArray(data.top_properties)).toBe(true);
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getOwnerDashboard()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API statistics.getTenantDashboard', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne le dashboard locataire complet', async () => {
    const r = await getTenantDashboard('30days');
    const data = r.data;
    expect(data).toHaveProperty('requests');
    expect(data).toHaveProperty('favorites_count');
    expect(data).toHaveProperty('saved_searches');
    expect(data).toHaveProperty('contributor_points');
    expect(data).toHaveProperty('badges');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getTenantDashboard()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API statistics.getPopularProperties (public)', () => {
  it('retourne les annonces populaires sans token', async () => {
    localStorage.clear();
    const r = await getPopularProperties();
    expect(r).toHaveProperty('data');
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('la liste contient au moins une annonce', async () => {
    const r = await getPopularProperties();
    expect(r.data.length).toBeGreaterThan(0);
  });
});
