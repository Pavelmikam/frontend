import { describe, it, expect } from 'vitest';
import { getPropertiesMap } from '@/api/property.api';

describe('API property.getPropertiesMap', () => {

  it('retourne des données légères pour la carte', async () => {
    const response = await getPropertiesMap();
    expect(Array.isArray(response.data || response)).toBe(true);
  });

  it('chaque entrée a les champs nécessaires aux marqueurs', async () => {
    const item = (await getPropertiesMap()).data[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('latitude');
    expect(item).toHaveProperty('longitude');
    expect(item).toHaveProperty('price');
    expect(item).toHaveProperty('type');
  });

  it('les champs lourds sont absents', async () => {
    const item = (await getPropertiesMap()).data[0];
    expect(item).not.toHaveProperty('description');
    expect(item).not.toHaveProperty('amenities');
    expect(item).not.toHaveProperty('address');
  });

  it('accepte les mêmes filtres que getProperties', async () => {
    const r = await getPropertiesMap({ city: 'Yaoundé', type: 'studio' });
    expect(r.data || r).toBeDefined();
  });
});
