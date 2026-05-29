import { useQuery } from '@tanstack/react-query';
import { getPropertiesForMap } from '@/api/search.api';

const useMapSearch = (filters = {}) => {
  return useQuery({
    queryKey: ['properties', 'map', filters],
    queryFn: () => getPropertiesForMap(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export default useMapSearch;
