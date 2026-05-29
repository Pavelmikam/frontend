import { describe, it, expect, beforeEach } from 'vitest';
import { searchProperties, getPropertiesForMap } from '@/api/search.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API search.searchProperties', () => {

  it('retourne une liste paginée sans filtres', async () => {
    const data = await searchProperties();
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('accepte des filtres avancés (city, type, prix)', async () => {
    const data = await searchProperties({
      city: 'Yaoundé', type: 'studio',
      price_min: 50000, price_max: 150000,
    });
    expect(data.data).toBeDefined();
  });

  it('accepte les filtres amenities en tableau', async () => {
    const data = await searchProperties({
      amenities: ['eau_courante', 'electricite'],
    });
    expect(data.data).toBeDefined();
  });

  it('accepte les filtres de géolocalisation', async () => {
    const data = await searchProperties({
      latitude: 3.8667, longitude: 11.5167, radius_km: 5,
    });
    expect(data.data).toBeDefined();
  });

  it('retourne 422 si price_max < price_min', async () => {
    await expect(
      searchProperties({ price_min: 100000, price_max: 50000 })
    ).rejects.toMatchObject({ response: { status: 422 } });
  });

  it("l'erreur 422 contient les erreurs de validation laravel", async () => {
    try {
      await searchProperties({ price_min: 100000, price_max: 50000 });
    } catch (error) {
      expect(error.validationErrors).toHaveProperty('price_max');
      expect(Array.isArray(error.validationErrors.price_max)).toBe(true);
    }
  });
});

describe('API search.getPropertiesForMap', () => {

  it('retourne les données allégées (lat/lng/price/type)', async () => {
    const data = await getPropertiesForMap();
    expect(data.data).toBeDefined();
    const item = data.data[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('latitude');
    expect(item).toHaveProperty('longitude');
    expect(item).toHaveProperty('price');
    expect(item).toHaveProperty('type');
  });

  it("ne contient pas les champs lourds (description, amenities)", async () => {
    const data = await getPropertiesForMap();
    const item = data.data[0];
    expect(item).not.toHaveProperty('description');
    expect(item).not.toHaveProperty('amenities');
    expect(item).not.toHaveProperty('address');
  });

  it('accepte les mêmes filtres que searchProperties', async () => {
    const data = await getPropertiesForMap({ city: 'Yaoundé', type: 'studio' });
    expect(data.data).toBeDefined();
  });
});
