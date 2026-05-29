import { describe, it, expect } from 'vitest';
import {
  formatPrice, formatPriceShort,
  filtersToQueryString, queryStringToFilters,
} from '@/utils/formatters';

describe('formatPrice', () => {
  it('formate un prix avec FCFA/mois', () => {
    const r = formatPrice(150000);
    expect(r).toContain('FCFA');
    expect(r).toContain('150');
  });
  it('retourne "—" pour null/undefined', () => {
    expect(formatPrice(null)).toBe('—');
    expect(formatPrice(undefined)).toBe('—');
  });
});

describe('formatPriceShort', () => {
  it('formate avec F', () => {
    expect(formatPriceShort(50000)).toContain('F');
  });
  it('gère 0 (ne retourne pas "—")', () => {
    expect(formatPriceShort(0)).not.toBe('—');
  });
});

describe('filtersToQueryString', () => {
  it('sérialise un objet simple', () => {
    const qs = filtersToQueryString({ city: 'Yaoundé', type: 'studio' });
    expect(qs).toContain('type=studio');
  });
  it('sérialise un tableau en multi-valeurs avec []', () => {
    const qs = filtersToQueryString({ amenities: ['wifi', 'parking'] });
    expect(qs).toContain('wifi');
    expect(qs).toContain('parking');
  });
  it('ignore les valeurs null/undefined/vides', () => {
    const qs = filtersToQueryString({ city: '', type: null, rooms: undefined });
    expect(qs).toBe('');
  });
  it('ignore les tableaux vides', () => {
    const qs = filtersToQueryString({ amenities: [] });
    expect(qs).toBe('');
  });
});

describe('queryStringToFilters', () => {
  it('désérialise un objet simple', () => {
    const params = new URLSearchParams('city=Yaound%C3%A9&type=studio');
    const f = queryStringToFilters(params);
    expect(f.city).toBe('Yaoundé');
    expect(f.type).toBe('studio');
  });
  it('reconstruit les tableaux depuis les clés[]', () => {
    const params = new URLSearchParams('amenities%5B%5D=wifi&amenities%5B%5D=parking');
    const f = queryStringToFilters(params);
    expect(Array.isArray(f.amenities)).toBe(true);
    expect(f.amenities).toContain('wifi');
    expect(f.amenities).toContain('parking');
  });
  it('retourne un objet vide pour une query string vide', () => {
    const f = queryStringToFilters(new URLSearchParams(''));
    expect(Object.keys(f).length).toBe(0);
  });
});
