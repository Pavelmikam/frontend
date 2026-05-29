import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchProperties } from '@/api/search.api';
import { queryStringToFilters } from '@/utils/formatters';

const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => queryStringToFilters(searchParams),
    [searchParams]
  );

  const query = useQuery({
    queryKey: ['properties', 'search', filters],
    queryFn: () => searchProperties(filters),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2,
  });

  const updateFilters = useCallback((newFilters) => {
    setSearchParams((prev) => {
      const current = queryStringToFilters(prev);
      const merged = { ...current, ...newFilters, page: 1 };

      Object.keys(merged).forEach((key) => {
        if (
          merged[key] === null ||
          merged[key] === undefined ||
          merged[key] === '' ||
          (Array.isArray(merged[key]) && merged[key].length === 0)
        ) {
          delete merged[key];
        }
      });

      const params = new URLSearchParams();
      Object.entries(merged).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(`${key}[]`, v));
        } else {
          params.set(key, String(value));
        }
      });
      return params;
    });
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const goToPage = useCallback((page) => {
    updateFilters({ page });
  }, [updateFilters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    goToPage,
    properties:         query.data?.data ?? [],
    pagination:         query.data?.meta ?? null,
    isLoading:          query.isLoading,
    isFetching:         query.isFetching,
    isError:            query.isError,
    error:              query.error,
    activeFiltersCount: Object.keys(filters).filter(
      (k) => !['page', 'sort', 'per_page'].includes(k) && filters[k]
    ).length,
  };
};

export default useSearch;
