import useAuthStore from '@/store/authStore';
import { ROLES } from '@/utils/constants';

const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    loginAction,
    registerAction,
    logoutAction,
    fetchMe,
    updateUser,
    clearError,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    login: loginAction,
    register: registerAction,
    logout: logoutAction,
    fetchMe,
    updateUser,
    clearError,
    isAdmin:         user?.role === ROLES.ADMIN,
    isProprietaire:  user?.role === ROLES.PROPRIETAIRE,
    isLocataire:     user?.role === ROLES.LOCATAIRE,
    isEmailVerified: !!user?.email_verified_at,
    isSuspended:     user?.is_active === false,
  };
};

export default useAuth;
