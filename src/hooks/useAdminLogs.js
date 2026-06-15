import { useQuery } from '@tanstack/react-query';
import { getAdminLogs } from '@/api/admin.api';
import useAuth from './useAuth';

export const useAdminLogs = (params = {}) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['adminLogs', params],
    queryFn: () => getAdminLogs(params),
    enabled: isAdmin,
    staleTime: 1000 * 30,
  });
};
