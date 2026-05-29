import { describe, it, expect, beforeEach } from 'vitest';
import { logout } from '@/api/auth.api';
import { saveToken, getToken } from '@/utils/tokenUtils';
import { mockToken } from '../mocks/handlers';

describe('API auth.logout', () => {

  it('retourne 204 avec un token valide', async () => {
    saveToken(mockToken);
    await expect(logout()).resolves.not.toThrow();
  });

  it("ne lance pas d'erreur même sans token", async () => {
    await expect(logout()).resolves.not.toThrow();
  });
});

describe('Store Zustand — logoutAction', () => {
  beforeEach(async () => {
    const { default: useAuthStore } = await import('@/store/authStore');
    useAuthStore.setState({
      user: { id: 1, name: 'Test' },
      token: mockToken,
      isAuthenticated: true,
    });
    saveToken(mockToken);
  });

  it('remet le store à zéro après déconnexion', async () => {
    const { default: useAuthStore } = await import('@/store/authStore');

    await useAuthStore.getState().logoutAction();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('supprime le token du localStorage', async () => {
    const { default: useAuthStore } = await import('@/store/authStore');

    await useAuthStore.getState().logoutAction();

    expect(getToken()).toBeNull();
  });

  it("effectue la déconnexion locale même si l'API échoue", async () => {
    const { default: useAuthStore } = await import('@/store/authStore');
    const { server } = await import('../mocks/server');
    const { http, HttpResponse } = await import('msw');

    server.use(
      http.post('http://localhost:8000/api/auth/logout', () => {
        return HttpResponse.error();
      })
    );

    await useAuthStore.getState().logoutAction();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(getToken()).toBeNull();
  });
});
