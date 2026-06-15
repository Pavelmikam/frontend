import { describe, it, expect, beforeEach } from 'vitest';
import { submitNeighborhoodReport, getMyNeighborhoodReports, getMyContributorProfile } from '@/api/neighborhood.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API neighborhood.submitNeighborhoodReport', () => {
  beforeEach(() => saveToken(mockToken));

  it('soumet une évaluation et retourne 201', async () => {
    const r = await submitNeighborhoodReport({
      criterion: 'eau',
      score: 3,
      latitude: 3.8667,
      longitude: 11.5167,
      city: 'Yaoundé',
      neighborhood: 'Bastos',
    });
    const report = r.data ?? r;
    expect(report).toHaveProperty('id');
    expect(report.criterion).toBe('eau');
    expect(report).not.toHaveProperty('is_flagged');
    expect(report).not.toHaveProperty('user_id');
  });

  it('retourne 422 si score hors plage (score > 5)', async () => {
    try {
      await submitNeighborhoodReport({ criterion: 'eau', score: 6, latitude: 3.8667, longitude: 11.5167 });
      expect.fail('devait rejeter');
    } catch (error) {
      expect(error.response.status).toBe(422);
    }
  });

  it('retourne 422 pour l\'anti-spam (double soumission même zone)', async () => {
    try {
      await submitNeighborhoodReport({
        criterion: 'eau', score: 3,
        latitude: 3.8667, longitude: 11.5167,
        _simulateSpam: true,
      });
      expect.fail('devait rejeter');
    } catch (error) {
      expect(error.response.status).toBe(422);
      const msg = error.userMessage || error.response.data.message;
      expect(msg).toContain('déjà évalué');
    }
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(
      submitNeighborhoodReport({ criterion: 'eau', score: 3, latitude: 3.8667, longitude: 11.5167 })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API neighborhood.getMyNeighborhoodReports', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la liste paginée des évaluations', async () => {
    const r = await getMyNeighborhoodReports();
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
    expect(Array.isArray(r.data)).toBe(true);
    expect(r.data.length).toBeGreaterThan(0);
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getMyNeighborhoodReports()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API neighborhood.getMyContributorProfile', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne le profil contributeur complet', async () => {
    const r = await getMyContributorProfile();
    expect(r).toHaveProperty('contributor_points');
    expect(r).toHaveProperty('reports_count');
    expect(r).toHaveProperty('badges');
    expect(Array.isArray(r.badges)).toBe(true);
  });

  it('les points contributeur sont un entier positif', async () => {
    const r = await getMyContributorProfile();
    expect(typeof r.contributor_points).toBe('number');
    expect(r.contributor_points).toBeGreaterThanOrEqual(0);
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getMyContributorProfile()).rejects.toMatchObject({ response: { status: 401 } });
  });
});
