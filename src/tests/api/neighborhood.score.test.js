import { describe, it, expect } from 'vitest';
import {
  getNeighborhoodScore,
  getPropertyNeighborhoodScore,
  getNeighborhoodHistory,
} from '@/api/neighborhood.api';

describe('API neighborhood.getNeighborhoodScore (public)', () => {

  it('retourne le score pour des coordonnées Yaoundé', async () => {
    const r = await getNeighborhoodScore(3.8667, 11.5167);
    expect(r).toHaveProperty('data');
    expect(r.data).not.toBeNull();
    expect(r.data).toHaveProperty('global_score');
    expect(r.data).toHaveProperty('criteria');
  });

  it('retourne null pour une zone sans données', async () => {
    const r = await getNeighborhoodScore(0, 0);
    expect(r.data).toBeNull();
  });

  it('ne nécessite pas de token (endpoint public)', async () => {
    localStorage.clear();
    const r = await getNeighborhoodScore(3.8667, 11.5167);
    expect(r.data).toBeDefined();
  });

  it('la structure des critères est correcte', async () => {
    const r = await getNeighborhoodScore(3.8667, 11.5167);
    const criteria = r.data.criteria;
    expect(criteria).toBeDefined();
    const firstCriterion = Object.values(criteria)[0];
    expect(firstCriterion).toHaveProperty('score');
    expect(firstCriterion).toHaveProperty('label');
    expect(firstCriterion).toHaveProperty('color');
  });

  it('global_score est un nombre entre 1 et 5', async () => {
    const r = await getNeighborhoodScore(3.8667, 11.5167);
    expect(r.data.global_score).toBeGreaterThanOrEqual(1);
    expect(r.data.global_score).toBeLessThanOrEqual(5);
  });
});

describe('API neighborhood.getPropertyNeighborhoodScore', () => {

  it('retourne le score du quartier d\'un bien', async () => {
    const r = await getPropertyNeighborhoodScore(1);
    expect(r).toHaveProperty('data');
    expect(r.data).toHaveProperty('global_score');
    expect(r.data).toHaveProperty('city');
    expect(r.data).toHaveProperty('neighborhood');
  });

  it('retourne null pour un bien sans coordonnées (id 999)', async () => {
    const r = await getPropertyNeighborhoodScore(999);
    expect(r.data).toBeNull();
  });
});

describe('API neighborhood.getNeighborhoodHistory', () => {

  it('retourne 6 mois d\'historique', async () => {
    const r = await getNeighborhoodHistory('Yaoundé', 'Bastos', 'eau');
    expect(r).toHaveProperty('data');
    expect(Array.isArray(r.data)).toBe(true);
    expect(r.data).toHaveLength(6);
  });

  it('la structure de chaque mois est correcte', async () => {
    const r = await getNeighborhoodHistory('Yaoundé', 'Bastos', 'electricite');
    const month = r.data[0];
    expect(month).toHaveProperty('month');
    expect(month).toHaveProperty('label');
    expect('average_score' in month).toBe(true);
  });

  it('tolère les mois sans données (average_score null)', async () => {
    const r = await getNeighborhoodHistory('Yaoundé', 'Bastos', 'eau');
    const hasNull = r.data.some((m) => m.average_score === null);
    expect(hasNull).toBe(true);
  });
});
