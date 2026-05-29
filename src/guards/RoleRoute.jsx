import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

const RoleRoute = ({ roles = [] }) => {
  const { user, isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return null;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
