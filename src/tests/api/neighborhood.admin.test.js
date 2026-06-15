import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAdminNeighborhoodReports,
  flagNeighborhoodReport,
  validateNeighborhoodReport,
  recomputeNeighborhoodScores,
} from '@/api/neighborhood.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API admin.neighborhood.getReports', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la liste paginée des rapports de quartier', async () => {
    const r = await getAdminNeighborhoodReports();
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
    expect(Array.isArray(r.data)).toBe(true);
    expect(r.data.length).toBeGreaterThan(0);
  });

  it('chaque rapport a les champs attendus', async () => {
    const r = await getAdminNeighborhoodReports();
    const report = r.data[0];
    expect(report).toHaveProperty('criterion');
    expect(report).toHaveProperty('score');
    expect(report).toHaveProperty('is_validated');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getAdminNeighborhoodReports()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.neighborhood.flagReport', () => {
  beforeEach(() => saveToken(mockToken));

  it('signale un rapport comme suspect', async () => {
    const r = await flagNeighborhoodReport(1);
    expect(r).toHaveProperty('message');
    expect(r.message).toContain('suspect');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(flagNeighborhoodReport(1)).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.neighborhood.validateReport', () => {
  beforeEach(() => saveToken(mockToken));

  it('revalide un rapport flaggé', async () => {
    const r = await validateNeighborhoodReport(2);
    expect(r).toHaveProperty('message');
    expect(r.message).toContain('revalidé');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(validateNeighborhoodReport(2)).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.neighborhood.recompute', () => {
  beforeEach(() => saveToken(mockToken));

  it('recalcule les scores d\'une ville', async () => {
    const r = await recomputeNeighborhoodScores('Yaoundé');
    expect(r).toHaveProperty('message');
    expect(r).toHaveProperty('scores_updated');
    expect(typeof r.scores_updated).toBe('number');
  });

  it('retourne 422 si ville manquante', async () => {
    try {
      await recomputeNeighborhoodScores('');
      expect.fail('devait rejeter');
    } catch (error) {
      expect(error.response.status).toBe(422);
    }
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(recomputeNeighborhoodScores('Yaoundé')).rejects.toMatchObject({ response: { status: 401 } });
  });
});
