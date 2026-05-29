import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSavedSearches, createSavedSearch, updateSavedSearch,
  deleteSavedSearch, toggleSavedSearchNotifications, getSavedSearchResults,
} from '@/api/savedSearch.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API savedSearch.getSavedSearches', () => {

  beforeEach(() => { localStorage.clear(); saveToken(mockToken); });

  it('retourne la liste des recherches', async () => {
    const r = await getSavedSearches();
    expect(Array.isArray(r.data || r)).toBe(true);
  });

  it('chaque recherche expose les champs attendus', async () => {
    const data = await getSavedSearches();
    const s = data.data[0];
    expect(s).toHaveProperty('id');
    expect(s).toHaveProperty('name');
    expect(s).toHaveProperty('criteria');
    expect(s).toHaveProperty('notifications_enabled');
    expect(s).not.toHaveProperty('user_id');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getSavedSearches()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API savedSearch.createSavedSearch', () => {

  beforeEach(() => { localStorage.clear(); saveToken(mockToken); });

  it('crée et retourne les données sauvegardées', async () => {
    const r = await createSavedSearch({ name: 'Studio Bastos', criteria: { city: 'Yaoundé' } });
    const s = r.data || r;
    expect(s).toHaveProperty('id');
    expect(s.name).toBe('Studio Bastos');
  });

  it('retourne 422 SAVED_SEARCH_LIMIT_REACHED à la limite', async () => {
    try {
      await createSavedSearch({ name: 'test', criteria: {}, _simulateLimit: true });
    } catch (error) {
      expect(error.response.status).toBe(422);
      expect(error.response.data.code).toBe('SAVED_SEARCH_LIMIT_REACHED');
    }
  });
});

describe('API savedSearch.updateSavedSearch', () => {

  beforeEach(() => { localStorage.clear(); saveToken(mockToken); });

  it("met à jour le nom d'une recherche", async () => {
    const r = await updateSavedSearch(1, { name: 'Nouveau nom' });
    const s = r.data || r;
    expect(s.name).toBe('Nouveau nom');
  });
});

describe('API savedSearch.deleteSavedSearch', () => {

  beforeEach(() => { localStorage.clear(); saveToken(mockToken); });

  it('supprime sans erreur (HTTP 204)', async () => {
    await expect(deleteSavedSearch(1)).resolves.not.toThrow();
  });
});

describe('API savedSearch.toggleNotifications', () => {

  beforeEach(() => { localStorage.clear(); saveToken(mockToken); });

  it('retourne le nouveau statut notifications_enabled et un message', async () => {
    const data = await toggleSavedSearchNotifications(1);
    expect(typeof data.notifications_enabled).toBe('boolean');
    expect(typeof data.message).toBe('string');
    expect(data.message.length).toBeGreaterThan(0);
  });
});

describe('API savedSearch.getSavedSearchResults', () => {

  beforeEach(() => { localStorage.clear(); saveToken(mockToken); });

  it('retourne les résultats paginés de la recherche', async () => {
    const data = await getSavedSearchResults(1);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('retourne 401 si non connecté', async () => {
    localStorage.clear();
    await expect(getSavedSearchResults(1)).rejects.toMatchObject({ response: { status: 401 } });
  });
});
