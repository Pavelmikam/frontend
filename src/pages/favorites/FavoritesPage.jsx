import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavoritesList } from '@/hooks/useFavorites';
import PropertyCard from '@/components/ui/PropertyCard';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { ROUTES } from '@/utils/constants';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useFavoritesList({ page });

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
            <h1 className="text-2xl font-bold text-gray-900">Mes annonces sauvegardées</h1>
            {total > 0 && (
              <p className="text-sm text-gray-500 mt-0.5">{total} annonce{total > 1 ? 's' : ''}</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-700">Vous n'avez pas encore de favoris.</p>
            <p className="text-sm mt-1">Explorez les annonces et sauvegardez celles qui vous plaisent.</p>
            <Button
              variant="primary"
              className="mt-5"
              onClick={() => navigate(ROUTES.ANNONCES)}
            >
              Parcourir les annonces
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {lastPage > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Précédent
                </Button>
                <span className="text-sm text-gray-600">Page {page} sur {lastPage}</span>
                <Button variant="outline" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
