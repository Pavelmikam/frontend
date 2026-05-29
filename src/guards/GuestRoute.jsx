import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

const GuestRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return null;

  return isAuthenticated
    ? <Navigate to={ROUTES.DASHBOARD} replace />
    : <Outlet />;
};

export default GuestRoute;
