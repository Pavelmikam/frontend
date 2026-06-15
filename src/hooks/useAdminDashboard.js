import { useQuery } from '@tanstack/react-query';
import { getAdminDashboard } from '@/api/admin.api';
import useAuth from './useAuth';

export const useAdminDashboard = () => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: getAdminDashboard,
    enabled: isAdmin,
    refetchInterval: 60000,
    staleTime: 1000 * 55,
  });
};
