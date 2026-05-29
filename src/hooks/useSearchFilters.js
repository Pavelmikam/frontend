import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    city:           searchParams.get('city') || '',
    type:           searchParams.get('type') || '',
    neighborhood:   searchParams.get('neighborhood') || '',
    price_min:      searchParams.get('price_min') || '',
    price_max:      searchParams.get('price_max') || '',
    surface_min:    searchParams.get('surface_min') || '',
    surface_max:    searchParams.get('surface_max') || '',
    rooms_min:      searchParams.get('rooms_min') || '',
    amenities:      searchParams.getAll('amenities[]') || [],
    available_from: searchParams.get('available_from') || '',
    latitude:       searchParams.get('latitude') || '',
    longitude:      searchParams.get('longitude') || '',
    radius_km:      searchParams.get('radius_km') || '',
    sort:           searchParams.get('sort') || 'newest',
    per_page:       searchParams.get('per_page') || '15',
    page:           searchParams.get('page') || '1',
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (['sort', 'per_page', 'page'].includes(key)) return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== '';
  }).length;

  const setFilter = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', '1');
      if (Array.isArray(value)) {
        next.delete(`${key}[]`);
        value.forEach((v) => next.append(`${key}[]`, v));
      } else if (value === '' || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  }, [setSearchParams]);

  const applyFilters = useCallback((newFilters) => {
    const next = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => next.append(`${key}[]`, v));
      } else if (value !== '' && value !== null && value !== undefined) {
        next.set(key, value);
      }
    });
    next.set('page', '1');
    setSearchParams(next);
  }, [setSearchParams]);

  // Partial update — merges changes into current URL params without replacing all
  const mergeFilters = useCallback((changes) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', '1');
      Object.entries(changes).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          next.delete(`${key}[]`);
          if (value.length > 0) value.forEach((v) => next.append(`${key}[]`, v));
        } else if (value === null || value === undefined || value === '') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const setPage = useCallback((page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(page));
      return next;
    });
  }, [setSearchParams]);

  const toApiParams = useCallback(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) params[key] = value;
      else if (value !== '' && value !== null && value !== undefined) params[key] = value;
    });
    return params;
  }, [filters]);

  return {
    filters,
    activeFiltersCount,
    setFilter,
    applyFilters,
    mergeFilters,
    resetFilters,
    setPage,
    toApiParams,
  };
};
