import { describe, it, expect, beforeEach } from 'vitest';
import { register } from '@/api/auth.api';
import { mockToken } from '../mocks/handlers';

const validRegisterData = {
  name: 'Test User',
  email: 'nouveau@test.cm',
  password: 'Password1',
  password_confirmation: 'Password1',
  role: 'locataire',
  phone: '+237655123456',
};

describe('API auth.register', () => {

  it('retourne token et user pour une inscription valide', async () => {
    const data = await register(validRegisterData);

    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('user');
    expect(data.token).toBe(mockToken);
    expect(data.user.role).toBe('locataire');
  });

  it("retourne une erreur 422 si l'email est déjà utilisé", async () => {
    try {
      await register({ ...validRegisterData, email: 'existe@test.cm' });
    } catch (error) {
      expect(error.response.status).toBe(422);
      expect(error.validationErrors).toHaveProperty('email');
      expect(error.validationErrors.email[0]).toContain('déjà utilisée');
    }
  });

  it('les erreurs de validation sont accessibles via error.validationErrors', async () => {
    try {
      await register({ ...validRegisterData, email: 'existe@test.cm' });
    } catch (error) {
      expect(error.validationErrors).toBeDefined();
      expect(Array.isArray(error.validationErrors.email)).toBe(true);
    }
  });
});

describe('Store Zustand — registerAction', () => {
  beforeEach(async () => {
    localStorage.clear();
    const { default: useAuthStore } = await import('@/store/authStore');
    useAuthStore.setState({
      user: null, token: null, isAuthenticated: false,
      isLoading: false, error: null,
    });
  });

  it("met isAuthenticated=true après une inscription réussie", async () => {
    const { default: useAuthStore } = await import('@/store/authStore');

    await useAuthStore.getState().registerAction(validRegisterData);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBeTruthy();
    expect(state.user).not.toBeNull();
  });

  it('sauvegarde le token dans localStorage', async () => {
    const { default: useAuthStore } = await import('@/store/authStore');

    await useAuthStore.getState().registerAction(validRegisterData);

    const stored = localStorage.getItem('immoconnect_token');
    expect(stored).toBeTruthy();
  });
});
