import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAdminAmenityCategories, createAmenityCategory,
  updateAmenityCategory, disableAmenityCategory,
} from '@/api/admin.api';
import { getReferenceAmenities, getReferencePropertyTypes, getReferenceCharges } from '@/api/reference.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken, mockAmenityCategory } from '../mocks/handlers';

describe('API admin.getAdminAmenityCategories', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la liste des catégories', async () => {
    const r = await getAdminAmenityCategories();
    expect(r).toHaveProperty('data');
    expect(Array.isArray(r.data)).toBe(true);
    expect(r.data.length).toBeGreaterThan(0);
  });

  it('chaque catégorie a les champs attendus', async () => {
    const r = await getAdminAmenityCategories();
    const cat = r.data[0];
    expect(cat).toHaveProperty('id');
    expect(cat).toHaveProperty('category');
    expect(cat).toHaveProperty('value');
    expect(cat).toHaveProperty('label');
    expect(cat).toHaveProperty('is_active');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getAdminAmenityCategories()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.createAmenityCategory', () => {
  beforeEach(() => saveToken(mockToken));

  it('crée une nouvelle catégorie avec succès', async () => {
    const payload = { category: 'amenity', value: 'piscine', label: 'Piscine', sort_order: 50 };
    const r = await createAmenityCategory(payload);
    expect(r).toHaveProperty('data');
    expect(r.data.value).toBe('piscine');
    expect(r.data.label).toBe('Piscine');
  });

  it('retourne 422 si la valeur existe déjà (doublon)', async () => {
    await expect(
      createAmenityCategory({ category: 'amenity', value: 'internet_wifi', label: 'WiFi' })
    ).rejects.toMatchObject({ response: { status: 422 } });
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(
      createAmenityCategory({ category: 'amenity', value: 'test', label: 'Test' })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.updateAmenityCategory', () => {
  beforeEach(() => saveToken(mockToken));

  it('met à jour le label d\'une catégorie', async () => {
    const r = await updateAmenityCategory(mockAmenityCategory.id, { label: 'WiFi & Internet' });
    expect(r).toHaveProperty('data');
    expect(r.data.id).toBe(mockAmenityCategory.id);
    expect(r.data.label).toBe('WiFi & Internet');
  });
});

describe('API admin.disableAmenityCategory (soft disable)', () => {
  beforeEach(() => saveToken(mockToken));

  it('désactive une catégorie (soft delete, 204)', async () => {
    await expect(disableAmenityCategory(mockAmenityCategory.id)).resolves.toBeUndefined();
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(disableAmenityCategory(mockAmenityCategory.id)).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API reference (routes publiques sans auth)', () => {
  beforeEach(() => localStorage.clear());

  it('getReferenceAmenities retourne les équipements sans auth', async () => {
    const r = await getReferenceAmenities();
    expect(r).toHaveProperty('data');
    expect(Array.isArray(r.data)).toBe(true);
    const entry = r.data[0];
    expect(entry).toHaveProperty('value');
    expect(entry).toHaveProperty('label');
  });

  it('getReferencePropertyTypes retourne les types de biens sans auth', async () => {
    const r = await getReferencePropertyTypes();
    expect(r).toHaveProperty('data');
    expect(Array.isArray(r.data)).toBe(true);
  });

  it('getReferenceCharges retourne les charges sans auth', async () => {
    const r = await getReferenceCharges();
    expect(r).toHaveProperty('data');
    expect(Array.isArray(r.data)).toBe(true);
  });
});
