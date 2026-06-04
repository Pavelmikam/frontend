import { useQuery } from '@tanstack/react-query';
import { getProperty } from '@/api/property.api';

export const useProperty = (id) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id),
    enabled: !!id,
  });
};

export default useProperty;
