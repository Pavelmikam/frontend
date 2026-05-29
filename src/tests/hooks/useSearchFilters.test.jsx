import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useSearchFilters } from '@/hooks/useSearchFilters';

const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/annonces']}>{children}</MemoryRouter>
);

describe('useSearchFilters', () => {

  it('retourne les valeurs par défaut si URL vide', () => {
    const { result } = renderHook(() => useSearchFilters(), { wrapper });
    expect(result.current.filters.sort).toBe('newest');
    expect(result.current.filters.city).toBe('');
    expect(result.current.activeFiltersCount).toBe(0);
  });

  it('setFilter met à jour un filtre', () => {
    const { result } = renderHook(() => useSearchFilters(), { wrapper });
    act(() => result.current.setFilter('city', 'Yaoundé'));
    expect(result.current.filters.city).toBe('Yaoundé');
    expect(result.current.activeFiltersCount).toBe(1);
  });

  it('setFilter reset la page à 1', () => {
    const { result } = renderHook(() => useSearchFilters(), { wrapper });
    act(() => result.current.setPage(3));
    act(() => result.current.setFilter('city', 'Douala'));
    expect(result.current.filters.page).toBe('1');
  });

  it('resetFilters remet tout à zéro', () => {
    const { result } = renderHook(() => useSearchFilters(), { wrapper });
    act(() => result.current.setFilter('city', 'Yaoundé'));
    act(() => result.current.resetFilters());
    expect(result.current.filters.city).toBe('');
    expect(result.current.activeFiltersCount).toBe(0);
  });

  it('toApiParams exclut les valeurs vides', () => {
    const { result } = renderHook(() => useSearchFilters(), { wrapper });
    act(() => result.current.setFilter('city', 'Yaoundé'));
    const params = result.current.toApiParams();
    expect(params).toHaveProperty('city', 'Yaoundé');
    expect(params).not.toHaveProperty('type');
  });

  it('gère les amenities comme tableau', () => {
    const { result } = renderHook(() => useSearchFilters(), { wrapper });
    act(() => result.current.setFilter('amenities', ['wifi', 'parking']));
    expect(result.current.filters.amenities).toEqual(['wifi', 'parking']);
    expect(result.current.activeFiltersCount).toBe(1);
  });
});
