import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import Spinner from '@/components/ui/Spinner';

const PrivateRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated
    ? <Outlet />
    : <Navigate to={ROUTES.LOGIN} replace />;
};

export default PrivateRoute;
