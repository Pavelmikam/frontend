import { describe, it, expect, beforeEach } from 'vitest';
import { login } from '@/api/auth.api';
import { getToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API auth.login', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('retourne token et user avec des identifiants valides', async () => {
    const data = await login({ email: 'jean@test.cm', password: 'Password1' });

    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('user');
    expect(data.token).toBe(mockToken);
    expect(data.user.email).toBe('jean@test.cm');
    expect(data.token_type).toBe('Bearer');
  });

  it('throw une erreur 401 avec des identifiants invalides', async () => {
    await expect(
      login({ email: 'jean@test.cm', password: 'mauvais_mdp' })
    ).rejects.toThrow();
  });

  it('retourne le code ACCOUNT_SUSPENDED pour un compte suspendu', async () => {
    try {
      await login({ email: 'suspended@test.cm', password: 'Password1' });
    } catch (error) {
      expect(error.response.status).toBe(403);
      expect(error.response.data.code).toBe('ACCOUNT_SUSPENDED');
    }
  });

  it("l'erreur contient un userMessage lisible", async () => {
    try {
      await login({ email: 'jean@test.cm', password: 'wrong' });
    } catch (error) {
      expect(error.userMessage).toBeDefined();
      expect(typeof error.userMessage).toBe('string');
    }
  });
});

describe('Store Zustand — loginAction', () => {
  beforeEach(async () => {
    localStorage.clear();
    const { default: useAuthStore } = await import('@/store/authStore');
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('met à jour le store et localStorage après login réussi', async () => {
    const { default: useAuthStore } = await import('@/store/authStore');
    await useAuthStore.getState().loginAction({
      email: 'jean@test.cm',
      password: 'Password1',
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).not.toBeNull();
    expect(state.user.email).toBe('jean@test.cm');
    expect(state.token).toBe(mockToken);
    expect(getToken()).toBe(mockToken);
  });

  it("reset le store en cas d'échec de connexion", async () => {
    const { default: useAuthStore } = await import('@/store/authStore');

    await expect(
      useAuthStore.getState().loginAction({ email: 'jean@test.cm', password: 'wrong' })
    ).rejects.toThrow();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).not.toBeNull();
  });

  it('isLoading est false après la requête (succès ou échec)', async () => {
    const { default: useAuthStore } = await import('@/store/authStore');

    await useAuthStore.getState().loginAction({
      email: 'jean@test.cm',
      password: 'Password1',
    });

    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
