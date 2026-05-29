import { describe, it, expect, beforeEach } from 'vitest';
import { getFavorites, toggleFavorite, checkFavorite } from '@/api/favorite.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API favorite.getFavorites', () => {

  beforeEach(() => { localStorage.clear(); saveToken(mockToken); });

  it('retourne une liste paginée des favoris', async () => {
    const data = await getFavorites();
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('retourne 401 si non connecté', async () => {
    localStorage.clear();
    await expect(getFavorites()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API favorite.toggleFavorite', () => {

  beforeEach(() => { localStorage.clear(); saveToken(mockToken); });

  it('retourne is_favorited (boolean) et favorites_count (number)', async () => {
    const data = await toggleFavorite(1);
    expect(data).toHaveProperty('is_favorited');
    expect(data).toHaveProperty('favorites_count');
    expect(typeof data.is_favorited).toBe('boolean');
    expect(typeof data.favorites_count).toBe('number');
  });

  it('retourne un message en français non vide', async () => {
    const data = await toggleFavorite(1);
    expect(typeof data.message).toBe('string');
    expect(data.message.length).toBeGreaterThan(0);
  });

  it('retourne 401 si non connecté', async () => {
    localStorage.clear();
    await expect(toggleFavorite(1)).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API favorite.checkFavorite', () => {

  beforeEach(() => { localStorage.clear(); saveToken(mockToken); });

  it('retourne is_favorited et favorites_count', async () => {
    const data = await checkFavorite(1);
    expect(typeof data.is_favorited).toBe('boolean');
    expect(typeof data.favorites_count).toBe('number');
  });

  it('retourne 401 si non connecté', async () => {
    localStorage.clear();
    await expect(checkFavorite(1)).rejects.toMatchObject({ response: { status: 401 } });
  });
});
