import { useQuery } from '@tanstack/react-query';
import { getPropertiesMap } from '@/api/property.api';

export const usePropertiesMap = (params = {}, enabled = false) => {
  return useQuery({
    queryKey: ['propertiesMap', params],
    queryFn: () => getPropertiesMap(params),
    enabled,
    staleTime: 1000 * 60 * 3,
  });
};
