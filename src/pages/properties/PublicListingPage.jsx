import { lazy, Suspense, useState } from 'react';
import { SlidersHorizontal, Bookmark, Search } from 'lucide-react';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { usePropertiesMap } from '@/hooks/usePropertiesMap';
import { useProperties } from '@/hooks/useProperties';
import useAuth from '@/hooks/useAuth';
import PropertyCard from '@/components/ui/PropertyCard';
import PropertyCardList from '@/components/ui/PropertyCardList';
import Pagination from '@/components/ui/Pagination';
import SearchFiltersPanel from '@/components/search/SearchFiltersPanel';
import SearchSortBar from '@/components/search/SearchSortBar';
import SearchActiveFilters from '@/components/search/SearchActiveFilters';
import SaveSearchModal from '@/components/search/SaveSearchModal';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const LazyMapView = lazy(() => import('@/components/map/PropertiesMapView'));

const SkeletonCard = () => (
  <div className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
    </div>
  </div>
);

const PublicListingPage = () => {
  const { isAuthenticated } = useAuth();
  const {
    filters, activeFiltersCount,
    mergeFilters, resetFilters, setFilter, setPage, toApiParams,
  } = useSearchFilters();
  const apiParams = toApiParams();

  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const { data, isLoading, isFetching, isError } = useProperties(apiParams);
  const { data: mapData, isLoading: mapLoading } = usePropertiesMap(apiParams, viewMode === 'map');

  const properties = data?.data ?? [];
  const pagination = data?.meta ?? null;

  const handleRemoveFilter = (key, newValue) => {
    if (newValue !== undefined) {
      setFilter(key, newValue);
    } else {
      setFilter(key, null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Annonces immobilières</h1>
              <p className="text-sm text-gray-500 mt-0.5">Cameroun — Trouvez votre prochain logement</p>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  className="hidden sm:flex items-center gap-2"
                  onClick={() => setShowSaveModal(true)}
                >
                  <Bookmark className="h-4 w-4" />
                  Sauvegarder
                </Button>
              )}
              <button
                type="button"
                onClick={() => setShowMobileFilters((v) => !v)}
                className="flex items-center gap-2 lg:hidden bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      {showMobileFilters && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4">
          <SearchFiltersPanel
            filters={filters}
            onUpdate={mergeFilters}
            onReset={resetFilters}
            isLoading={isLoading}
            activeFiltersCount={activeFiltersCount}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20">
              <SearchFiltersPanel
                filters={filters}
                onUpdate={mergeFilters}
                onReset={resetFilters}
                isLoading={isLoading}
                activeFiltersCount={activeFiltersCount}
              />
              {isAuthenticated && activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  className="w-full mt-3 flex items-center justify-center gap-2"
                  onClick={() => setShowSaveModal(true)}
                >
                  <Bookmark className="h-4 w-4" />
                  Sauvegarder cette recherche
                </Button>
              )}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <SearchSortBar
              total={pagination?.total}
              sort={filters.sort}
              onSortChange={(val) => setFilter('sort', val || null)}
              isFetching={isFetching}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {activeFiltersCount > 0 && (
              <SearchActiveFilters
                filters={filters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={resetFilters}
              />
            )}

            {/* Map view */}
            {viewMode === 'map' ? (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200" style={{ height: '500px' }}>
                <Suspense fallback={<div className="h-full flex items-center justify-center bg-gray-50"><Spinner size="lg" /></div>}>
                  <LazyMapView
                    properties={mapData?.data || []}
                    isLoading={mapLoading}
                    filters={filters}
                  />
                </Suspense>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-3">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : isError ? (
              <div className="text-center py-16 text-gray-500">
                <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Erreur lors du chargement</p>
                <p className="text-sm mt-1">Veuillez réessayer ultérieurement.</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Aucune annonce ne correspond à vos critères.</p>
                {activeFiltersCount > 0 ? (
                  <button onClick={resetFilters} className="mt-3 text-sm text-blue-600 hover:underline">
                    Voir toutes les annonces
                  </button>
                ) : (
                  <p className="text-sm mt-1">Aucun bien disponible pour le moment.</p>
                )}
              </div>
            ) : (
              <>
                <div className={`mt-3 ${
                  viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                }`}>
                  {properties.map((property) =>
                    viewMode === 'list'
                      ? <PropertyCardList key={property.id} property={property} />
                      : <PropertyCard key={property.id} property={property} />
                  )}
                </div>

                {viewMode !== 'map' && (
                  <Pagination
                    currentPage={Number(filters.page) || 1}
                    lastPage={pagination?.last_page ?? 1}
                    onPageChange={setPage}
                    isLoading={isFetching}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <SaveSearchModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        currentFilters={apiParams}
      />
    </div>
  );
};

export default PublicListingPage;
