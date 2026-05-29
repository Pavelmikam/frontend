import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import PropertyCard from '@/components/ui/PropertyCard';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { ROUTES } from '@/utils/constants';

const SkeletonCard = () => (
  <div className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
    </div>
  </div>
);

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFavorites({ page });

  const properties = data?.data ?? [];
  const meta = data?.meta ?? {};
  const total = meta.total ?? properties.length;
  const lastPage = meta.last_page ?? 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-6 w-6 text-red-500" fill="#ef4444" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes annonces favorites</h1>
            {total > 0 && (
              <p className="text-sm text-gray-500 mt-0.5">({total} annonce{total > 1 ? 's' : ''})</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-700">Vous n'avez pas encore de favoris.</p>
            <p className="text-sm mt-1">
              Parcourez les annonces et cliquez sur ❤️ pour sauvegarder vos coups de cœur.
            </p>
            <Button variant="primary" className="mt-5" onClick={() => navigate(ROUTES.ANNONCES)}>
              Explorer les annonces
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              lastPage={lastPage}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
