import { useQuery } from '@tanstack/react-query';
import { getProperties } from '@/api/property.api';

export const useProperties = (params = {}) => {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => getProperties(params),
    staleTime: 1000 * 60 * 2,
  });
};
