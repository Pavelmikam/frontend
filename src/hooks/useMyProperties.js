import { useQuery } from '@tanstack/react-query';
import { getMyProperties } from '@/api/property.api';
import useAuth from './useAuth';

export const useMyProperties = (params = {}) => {
  const { isAuthenticated, isProprietaire, isAdmin } = useAuth();
  return useQuery({
    queryKey: ['myProperties', params],
    queryFn: () => getMyProperties(params),
    enabled: isAuthenticated && (isProprietaire || isAdmin),
  });
};

export default useMyProperties;
