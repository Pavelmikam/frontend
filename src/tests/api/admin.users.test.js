import { describe, it, expect, beforeEach } from 'vitest';
import { getAdminUsers, getAdminUser, suspendUser, activateUser, deleteAdminUser } from '@/api/admin.api';
import { saveToken } from '@/utils/tokenUtils';
import { mockToken, mockAdminUser } from '../mocks/handlers';

describe('API admin.getAdminUsers', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne la liste paginée des utilisateurs', async () => {
    const r = await getAdminUsers();
    expect(r).toHaveProperty('data');
    expect(r).toHaveProperty('meta');
    expect(Array.isArray(r.data)).toBe(true);
    expect(r.data.length).toBeGreaterThan(0);
  });

  it('chaque utilisateur a les champs attendus', async () => {
    const r = await getAdminUsers();
    const user = r.data[0];
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('is_active');
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(getAdminUsers()).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.getAdminUser', () => {
  beforeEach(() => saveToken(mockToken));

  it('retourne le détail d\'un utilisateur', async () => {
    const r = await getAdminUser(mockAdminUser.id);
    expect(r).toHaveProperty('data');
    expect(r.data).toHaveProperty('id', mockAdminUser.id);
    expect(r.data).toHaveProperty('email', mockAdminUser.email);
  });
});

describe('API admin.suspendUser', () => {
  beforeEach(() => saveToken(mockToken));

  it('suspend un utilisateur avec un motif valide', async () => {
    const r = await suspendUser(mockAdminUser.id, 'Comportement frauduleux répété');
    expect(r).toHaveProperty('message');
    expect(r).toHaveProperty('data');
    expect(r.data.is_active).toBe(false);
  });

  it('retourne 422 si le motif est trop court', async () => {
    await expect(
      suspendUser(mockAdminUser.id, 'court')
    ).rejects.toMatchObject({ response: { status: 422 } });
  });

  it('retourne 422 si on tente de suspendre un admin (id=1)', async () => {
    await expect(
      suspendUser(1, 'Motif suffisamment long pour passer la validation')
    ).rejects.toMatchObject({ response: { status: 422 } });
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(
      suspendUser(mockAdminUser.id, 'Motif valide suffisant')
    ).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.activateUser', () => {
  beforeEach(() => saveToken(mockToken));

  it('réactive un utilisateur suspendu', async () => {
    const r = await activateUser(mockAdminUser.id);
    expect(r).toHaveProperty('message');
    expect(r).toHaveProperty('data');
    expect(r.data.is_active).toBe(true);
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(activateUser(mockAdminUser.id)).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe('API admin.deleteAdminUser', () => {
  beforeEach(() => saveToken(mockToken));

  it('supprime un utilisateur standard (204)', async () => {
    await expect(deleteAdminUser(mockAdminUser.id)).resolves.toBeUndefined();
  });

  it('retourne 422 si on tente de supprimer un admin (id=1)', async () => {
    await expect(deleteAdminUser(1)).rejects.toMatchObject({ response: { status: 422 } });
  });

  it('retourne 401 sans token', async () => {
    localStorage.clear();
    await expect(deleteAdminUser(mockAdminUser.id)).rejects.toMatchObject({ response: { status: 401 } });
  });
});
