import { create } from 'zustand';
import { login, register, logout, getMe } from '@/api/auth.api';
import { saveToken, getToken, removeToken } from '@/utils/tokenUtils';

const useAuthStore = create((set, get) => ({
  user: null,
  token: getToken(),
  isAuthenticated: !!getToken(),
  isLoading: false,
  error: null,
  isInitialized: false,

  loginAction: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await login(credentials);
      saveToken(data.token);
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.userMessage || 'Erreur de connexion.',
        isAuthenticated: false,
        user: null,
        token: null,
      });
      throw error;
    }
  },

  registerAction: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await register(userData);
      saveToken(data.token);
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.userMessage || "Erreur lors de l'inscription.",
      });
      throw error;
    }
  },

  logoutAction: async () => {
    try {
      await logout();
    } catch {
      // Ignorer l'erreur serveur — déconnexion locale toujours effectuée
    } finally {
      removeToken();
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        error: null,
        isInitialized: true,
      });
    }
  },

  fetchMe: async () => {
    const token = getToken();
    if (!token) {
      set({ isInitialized: true, isAuthenticated: false, user: null });
      return;
    }
    set({ isLoading: true });
    try {
      const data = await getMe();
      set({
        user: data.data || data,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      removeToken();
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  updateUser: (userData) => {
    set({ user: userData });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
